"use client"

import React from 'react';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareButton = () => {
    const handleShare = () => {
        // Copy the current page URL to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
            <Share2 size={16} />
            Share this Video
        </button>
    );
};

export default ShareButton;