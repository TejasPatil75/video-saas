import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient()

export async function POST(request: NextRequest){
    try {
        const {userId} = await auth()

        if( !userId ){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const body = await request.json();
        const { title, description, publicId, originalSize, compressedSize, duration } = body;

        if (!publicId || !duration) {
             return NextResponse.json({ error: "Missing video metadata" }, { status: 400 });
        }

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId,
                originalSize: String(originalSize),
                compressedSize: String(compressedSize),
                duration: Number(duration),
                userId: userId // <--- Saving the User ID here
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log("Save video failed", error)
        return NextResponse.json({error: "Save video failed"} , {status:500})
    }
    finally{
        await prisma.$disconnect()
    }
}