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

            const Plyr = (await import('plyr')).default;

            // Fixed: Removed 'title' from these options as it caused the build error
            player = new Plyr(videoRef.current, {
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
                    'airplay',
                    'fullscreen',
                ],
                settings: ['speed'],
                speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
                autoplay: autoPlay,
            });

            // The title is correctly set here in the source object
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
        <div className="w-full h-full">
            <video
                ref={videoRef}
                className="plyr-react plyr"
                playsInline
                crossOrigin="anonymous"
            />
            <style jsx global>{`
                :root {
                    --plyr-color-main: #4F46E5; 
                }
            `}</style>
        </div>
    );
};

export default VideoPlayer;