"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary'
import { Download, Clock, Play, Share2, Trash2, Edit2, MoreVertical, FileDown } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"
import { Video } from "@/types";

dayjs.extend(relativeTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
    onWatch: (video: Video) => void;
    onShare?: (videoId: string) => void;
    onEdit?: (video: Video) => void;
    onDelete?: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onWatch, onShare, onEdit, onDelete }) => {

    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
        })
    }, [])

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
        })
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    useEffect(() => {
        setPreviewError(false);
    }, [isHovered]);

    const handleMenuAction = (action: () => void) => {
        setMenuOpen(false);
        action();
    };

    return (
        <div
            className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/50 hover:border-zinc-300 dark:hover:border-zinc-700 h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail / Preview Area */}
            <div
                className="aspect-video relative cursor-pointer bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
                onClick={() => onWatch(video)}
            >
                {isHovered ? (
                    previewError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                            <span className="text-xs">No preview</span>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover animate-in fade-in duration-300"
                            onError={() => setPreviewError(true)}
                        />
                    )
                ) : (
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 z-10">
                    <Clock size={10} />
                    {formatDuration(video.duration)}
                </div>

                {/* Play Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Play size={16} className="text-white fill-white ml-0.5" />
                    </div>
                </div>
            </div>
            
            {/* Content Area */}
            <div className="flex flex-col flex-1 p-4">
                <div className="flex justify-between items-start gap-2 mb-2 relative">
                    <h3 
                        className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                        onClick={() => onWatch(video)}
                    >
                        {video.title}
                    </h3>

                    {/* Custom Menu Dropdown */}
                    {(onShare || onEdit || onDelete) && (
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <MoreVertical size={16} />
                            </button>
                            
                            {menuOpen && (
                                <div className="absolute right-0 top-6 w-32 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    {onShare && (
                                        <button onClick={() => handleMenuAction(() => onShare(video.id))} className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2">
                                            <Share2 size={12} /> Share
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button onClick={() => handleMenuAction(() => onEdit(video))} className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2">
                                            <Edit2 size={12} /> Edit
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => handleMenuAction(() => onDelete(video.id))} className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                    {video.description || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                    <span className="text-xs text-zinc-400">
                        {dayjs(video.createdAt).fromNow()}
                    </span>
                    
                    <button
                        className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2.5 py-1.5 rounded-md transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(getFullVideoUrl(video.publicId), video.title)
                        }}
                    >
                        <FileDown size={14} /> 
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCard