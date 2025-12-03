"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { getCldVideoUrl } from 'next-cloudinary'
import { X, Search, Sparkles, Send, MessageCircle, ChevronDown, Clock, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import VideoPlayer from '@/components/VideoPlayer' 

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null) 
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isAskingAi, setIsAskingAi] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")

    // Reset chat when video changes
    useEffect(() => {
        if (!currentVideo) {
            setQuestion("");
            setAnswer("");
            setIsAskingAi(false);
        }
    }, [currentVideo]);

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if (Array.isArray(response.data)) {
                setVideos(response.data)
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load videos")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])

    const handleDownload = useCallback((url: string, title: string) => {
        const downloadPromise = fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Network error");
                return res.blob();
            })
            .then((blob) => {
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute("download", `${title}.mp4`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            });

        toast.promise(downloadPromise, {
            loading: 'Preparing download...',
            success: 'Download started',
            error: 'Download failed',
        });
    }, [])

    const handleShare = useCallback((videoId: string) => {
        const shareUrl = `${window.location.origin}/share/${videoId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
    }, []);

    const handleAskAi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentVideo || !question.trim()) return;

        setIsAskingAi(true);
        setAnswer(""); 

        try {
            const response = await axios.post("/api/ai/ask-question", {
                videoId: currentVideo.id,
                question: question
            });
            setAnswer(response.data.answer);
        } catch (error) {
            console.error(error);
            toast.error("AI Service Unavailable");
        } finally {
            setIsAskingAi(false);
        }
    };

    const getVideoUrl = (publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
        })
    }

    const filteredVideos = videos
        .filter(video => 
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === "largest") return Number(b.originalSize) - Number(a.originalSize);
            return 0;
        });

    if (loading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Discover</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Browse the latest community uploads.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-800 dark:group-focus-within:text-zinc-200 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search videos..." 
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select 
                            className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="largest">Size</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            {filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                    <Filter className="w-12 h-12 text-zinc-300 mb-4" />
                    <p className="text-zinc-500 font-medium">No videos found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                        <div key={video.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1">
                            <VideoCard
                                video={video}
                                onDownload={handleDownload}
                                onWatch={setCurrentVideo}
                                onShare={handleShare}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Cinematic Modal */}
            {currentVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-300">
                    <div className="bg-black border border-zinc-800 w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-[90vh] lg:h-[85vh]">
                        
                        {/* Video Player Area */}
                        <div className="flex-1 flex flex-col relative bg-black">
                            <div className="absolute top-4 left-4 z-10 lg:hidden">
                                <button onClick={() => setCurrentVideo(null)} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 flex items-center justify-center bg-black">
                                <VideoPlayer 
                                    src={getVideoUrl(currentVideo.publicId)}
                                    title={currentVideo.title}
                                    autoPlay={true}
                                />
                            </div>

                            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800">
                                <h2 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h2>
                                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                                    <span className="flex items-center gap-1"><Clock size={12}/> {Math.round(currentVideo.duration)}s</span>
                                    <span>•</span>
                                    <span>{new Date(currentVideo.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-zinc-300 text-sm leading-relaxed max-w-3xl">{currentVideo.description}</p>
                            </div>
                        </div>

                        {/* AI Interaction Sidebar */}
                        <div className="w-full lg:w-96 bg-zinc-950 border-l border-zinc-800 flex flex-col h-1/3 lg:h-auto">
                            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                                <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    AI Assistant
                                </h3>
                                <button onClick={() => setCurrentVideo(null)} className="hidden lg:block text-zinc-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950">
                                {!answer && !isAskingAi && (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-zinc-600">
                                        <MessageCircle className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm">Ask me anything about the content of this video.</p>
                                    </div>
                                )}

                                {question && answer && (
                                    <>
                                        <div className="flex justify-end">
                                            <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%]">
                                                {question}
                                            </div>
                                        </div>
                                        <div className="flex justify-start">
                                            <div className="bg-zinc-800 text-zinc-200 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[90%] border border-zinc-700">
                                                {answer}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {isAskingAi && (
                                    <div className="flex justify-start">
                                        <div className="bg-zinc-800/50 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleAskAi} className="p-4 border-t border-zinc-800 bg-zinc-950">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full bg-zinc-900 text-white text-sm pl-4 pr-12 py-3 rounded-xl border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-zinc-600 transition-all"
                                        placeholder="Ask a question..."
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        disabled={isAskingAi}
                                    />
                                    <button 
                                        type="submit" 
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                                        disabled={isAskingAi || !question.trim()}
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Home