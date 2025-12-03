import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Retrieve API Key from Environment Variable
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing in .env file");
            return NextResponse.json({ error: "Server misconfiguration: API Key missing" }, { status: 500 });
        }

        const { videoId, question } = await request.json();

        if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

        // 1. Fetch Video Metadata
        const video = await prisma.video.findUnique({ where: { id: videoId } });
        if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

        // 2. Generate 5 Frame URLs (Storyboard) 
        const duration = video.duration || 10;
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const offsets = [0, 0.2, 0.4, 0.6, 0.8];
        
        const imagePromises = offsets.map(async (offset) => {
            const time = Math.round(duration * offset);
            const url = `https://res.cloudinary.com/${cloudName}/video/upload/so_${time},w_400,c_fill,q_auto,f_jpg/${video.publicId}.jpg`;
            
            try {
                const res = await fetch(url);
                if (!res.ok) return null;
                const buffer = await res.arrayBuffer();
                return {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: Buffer.from(buffer).toString("base64")
                    }
                };
            } catch (e) {
                return null;
            }
        });

        const imageParts = (await Promise.all(imagePromises)).filter(p => p !== null);

        if (imageParts.length === 0) {
            return NextResponse.json({ error: "Failed to extract video frames" }, { status: 500 });
        }

        // 3. Construct Prompt
        const prompt = `
            You are an AI assistant analyzing a video. 
            I have provided ${imageParts.length} screenshots taken from the video at different intervals to give you visual context.
            
            Video Metadata:
            - Title: "${video.title}"
            - Description: "${video.description || ''}"
            
            User Question: "${question}"
            
            Answer the user's question based strictly on the visual context of the images and the metadata provided. 
            Keep the answer concise, friendly, and helpful.
        `;

        // 4. Call Gemini
        const payload = {
            contents: [{
                role: "user",
                parts: [
                    { text: prompt },
                    ...imageParts
                ]
            }],
            generationConfig: { responseMimeType: "text/plain" }
        };

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        
        const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer in the video.";

        return NextResponse.json({ answer });

    } catch (error) {
        console.error("AI Route Error:", error);
        return NextResponse.json({ error: "AI Analysis failed" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}