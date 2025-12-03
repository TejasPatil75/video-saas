"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types'
import { getCldVideoUrl } from 'next-cloudinary'
import { X, Search, AlertTriangle, User, Mail, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import VideoPlayer from '@/components/VideoPlayer' 
import { useUser } from '@clerk/nextjs'

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null) 
    const [editingVideo, setEditingVideo] = useState<Video | null>(null) 
    const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null) 
    const [searchQuery, setSearchQuery] = useState("")

    const fetchVideos = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await axios.get("/api/videos")
            if (Array.isArray(response.data)) {
                const userVideos = response.data.filter((v: Video) => v.userId === user.id);
                setVideos(userVideos);
            }
        } catch (error) {
            toast.error("Failed to load your videos")
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        if (isLoaded && user) fetchVideos();
    }, [isLoaded, user, fetchVideos])

    // ... handleDownload, handleShare logic remains the same ...
    // Copy/paste the helper functions from your original code if needed
    // For brevity, I am invoking the props in the JSX

    const handleDownload = (url:string, title:string) => { /* logic */ }
    const handleShare = (id:string) => { /* logic */ }

    const handleDeleteClick = (videoId: string) => setDeletingVideoId(videoId);

    const confirmDelete = async () => {
        if (!deletingVideoId) return;
        const toastId = toast.loading("Deleting...");
        try {
            await axios.delete(`/api/videos/${deletingVideoId}`);
            setVideos(prev => prev.filter(v => v.id !== deletingVideoId));
            toast.success("Deleted", { id: toastId });
        } catch (error) {
            toast.error("Failed", { id: toastId });
        } finally {
            setDeletingVideoId(null);
        }
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!editingVideo) return;
        
        try {
           await axios.patch(`/api/videos/${editingVideo.id}`, {
               title: editingVideo.title,
               description: editingVideo.description
           })
           setVideos(prev => prev.map(v => v.id === editingVideo.id ? editingVideo : v));
           setEditingVideo(null);
           toast.success("Updated successfully");
        } catch(e) {
           toast.error("Update failed");
        }
    };

    const getVideoUrl = (publicId: string) => getCldVideoUrl({ src: publicId, width: 1920, height: 1080 });

    const filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isLoaded || loading) {
        return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl">
                        <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-black"></div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{user?.fullName || user?.username}</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                        <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.primaryEmailAddress?.emailAddress}</span>
                        <span className="hidden md:inline">•</span>
                        <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-center md:justify-start gap-3">
                        <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <span className="block text-lg font-bold text-zinc-900 dark:text-white">{videos.length}</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-wide">Videos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs / Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 sm:mb-0">My Library</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Filter my videos..." 
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                    <div key={video.id} className="relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        {/* You can reuse VideoCard here, but passing edit/delete handlers */}
                        <VideoCard
                            video={video}
                            onWatch={setCurrentVideo}
                            onDownload={handleDownload}
                            onShare={handleShare}
                            onEdit={setEditingVideo}
                            onDelete={handleDeleteClick}
                        />
                    </div>
                ))}
            </div>
            
            {filteredVideos.length === 0 && (
                <div className="text-center py-20 text-zinc-400">
                    <p>No videos found.</p>
                </div>
            )}

            {/* Edit Modal - Styled cleanly */}
            {editingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-lg font-bold mb-4">Edit Details</h3>
                        <form onSubmit={handleEditSave} className="space-y-4">
                            <input 
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700" 
                                value={editingVideo.title} 
                                onChange={e => setEditingVideo({...editingVideo, title: e.target.value})}
                            />
                            <textarea 
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 h-24" 
                                value={editingVideo.description} 
                                onChange={e => setEditingVideo({...editingVideo, description: e.target.value})}
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setEditingVideo(null)} className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-lg">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* Delete Modal - Styled cleanly */}
            {deletingVideoId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 text-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Delete Video?</h3>
                        <p className="text-zinc-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-2 justify-center">
                            <button onClick={() => setDeletingVideoId(null)} className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}