import React from 'react';
import { PrismaClient } from "@/app/generated/prisma/client";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCldVideoUrl } from 'next-cloudinary';
import VideoPlayer from '@/components/VideoPlayer';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

const prisma = new PrismaClient();

interface SharePageProps {
    params: Promise<{
        videoId: string;
    }>;
}

export default async function SharePage({ params }: SharePageProps) {
    const { videoId } = await params;

    const video = await prisma.video.findUnique({
        where: { id: videoId }
    });

    if (!video) {
        return notFound();
    }

    const videoUrl = getCldVideoUrl({
        src: video.publicId,
        width: 1920,
        height: 1080,
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            
            {/* Navbar / Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link 
                        href="/home" 
                        className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to App
                    </Link>
                    <div className="font-bold text-lg tracking-tight">GLIMPSE</div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Video Player Container */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-zinc-200 dark:border-zinc-800 aspect-video mb-8">
                        <VideoPlayer 
                            src={videoUrl} 
                            title={video.title} 
                            autoPlay={false} 
                        />
                    </div>

                    {/* Video Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        
                        {/* Title & Description */}
                        <div className="lg:col-span-2 space-y-6">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                                {video.title}
                            </h1>
                            <div className="prose prose-zinc dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    {video.description}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 mb-2">Details</h3>
                                
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <Calendar size={14} />
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs">Uploaded</p>
                                        <p className="font-medium">{new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-xs">Duration</p>
                                        <p className="font-medium">{Math.round(video.duration)} seconds</p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <button className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm">
                                        <Share2 size={16} />
                                        Share this Video
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-zinc-500 text-sm border-t border-zinc-200 dark:border-zinc-900 mt-auto">
                <p>Powered by <span className="font-semibold text-zinc-900 dark:text-white">GLIMPSE</span></p>
            </footer>
        </div>
    );
}