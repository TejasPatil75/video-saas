import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// PATCH: Update Title/Description
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await props.params;
        const { title, description } = await request.json();

        // 1. Fetch video to verify ownership
        const existingVideo = await prisma.video.findUnique({ where: { id } });
        if (!existingVideo) return NextResponse.json({ error: "Video not found" }, { status: 404 });

        // 2. Check if the user trying to edit is the owner
        if (existingVideo.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const video = await prisma.video.update({
            where: { id },
            data: { title, description }
        });

        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ error: "Error updating video" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE: Remove from Cloudinary & DB
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await props.params;

        const video = await prisma.video.findUnique({ where: { id } });
        if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });

        // 1. Check ownership before deleting
        if (video.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 2. Delete from Cloudinary
        if (video.publicId) {
            await cloudinary.uploader.destroy(video.publicId, { resource_type: "video" });
        }

        // 3. Delete from Database
        await prisma.video.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error deleting video" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}