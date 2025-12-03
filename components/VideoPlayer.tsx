"use client"

import React, { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css'; 

interface VideoPlayerProps {
    src: string;
    title?: string;
    autoPlay?: boolean;
}

const VideoPlayer = ({ src, title, autoPlay = false }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        let player: any = null;

        const initPlayer = async () => {
            if (!videoRef.current) return;

            // Dynamically import Plyr for client-side only
            const Plyr = (await import('plyr')).default;

            player = new Plyr(videoRef.current, {
                title: title,
                controls: [
                    'play-large',
                    'play',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'settings',
                    'pip',
                    'fullscreen',
                ],
                settings: ['speed'],
                speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
                autoplay: autoPlay,
                // Customizing tooltips
                tooltips: { controls: true, seek: true },
            });

            player.source = {
                type: 'video',
                title: title,
                sources: [
                    {
                        src: src,
                        type: 'video/mp4',
                    },
                ],
            };
            
            playerRef.current = player;
        };

        initPlayer();

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [src, title, autoPlay]);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-xl">
            <video
                ref={videoRef}
                className="plyr-react plyr"
                playsInline
                crossOrigin="anonymous"
            />
            {/* We override the Plyr CSS variables to match our "Indigo" theme.
               --plyr-color-main: The primary color used for the progress bar and large play button.
               --plyr-video-background: Ensures the background is deep black.
            */}
            <style jsx global>{`
                :root {
                    --plyr-color-main: #4f46e5; 
                    --plyr-video-background: #000000;
                    --plyr-menu-background: #18181b;
                    --plyr-menu-color: #ffffff;
                    --plyr-range-track-height: 4px;
                    --plyr-range-thumb-height: 12px;
                    --plyr-range-thumb-active-shadow-width: 0px;
                }
                .plyr {
                    width: 100%;
                    height: 100%;
                    font-family: var(--font-geist-sans), sans-serif;
                }
                .plyr__control--overlaid {
                    background: rgba(79, 70, 229, 0.8) !important;
                }
                .plyr__control--overlaid:hover {
                    background: #4338ca !important;
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;