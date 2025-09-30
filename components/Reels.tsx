
import React, { useState, useRef, useEffect } from 'react';
import type { Reel } from '../types';
import { UploadIcon, PlayIcon, HeartIcon, CommentIcon, ShareIcon } from './icons/Icons';

const INITIAL_REELS: Reel[] = [
  {
    id: '1',
    url: 'https://videos.pexels.com/video-files/3840443/3840443-hd_720_1366_25fps.mp4',
    author: '@naturelover',
    description: 'Beautiful waterfall scenery',
  },
  {
    id: '2',
    url: 'https://videos.pexels.com/video-files/8763290/8763290-sd_540_960_30fps.mp4',
    author: '@citylights',
    description: 'Vibrant city life at night',
  },
  {
    id: '3',
    url: 'https://videos.pexels.com/video-files/4465124/4465124-hd_720_1366_25fps.mp4',
    author: '@petparadise',
    description: 'Cute puppy playing in the park',
  },
];

const ReelItem: React.FC<{ reel: Reel; isVisible: boolean }> = ({ reel, isVisible }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false);
    const clickTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            if (isVisible) {
                video.play().then(() => setIsPlaying(true)).catch(e => console.log("Autoplay blocked"));
            } else {
                video.pause();
                video.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }, [isVisible]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play().then(() => setIsPlaying(true));
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleVideoClick = () => {
        if (clickTimeoutRef.current) {
            // Double click
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            if (!liked) {
                setLiked(true);
            }
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 800);
        } else {
            // Single click
            clickTimeoutRef.current = window.setTimeout(() => {
                togglePlay();
                clickTimeoutRef.current = null;
            }, 250);
        }
    };
    
    return (
        <div className="h-full w-full relative snap-start flex-shrink-0 bg-black">
            <video
                ref={videoRef}
                src={reel.url}
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
            />
            <div className="absolute inset-0" onClick={handleVideoClick}>
                 {!isPlaying && isVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <PlayIcon className="w-20 h-20 text-white opacity-80" />
                    </div>
                )}
                {showHeart && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <HeartIcon className="w-24 h-24 text-red-500/90 animate-like" fill="currentColor"/>
                    </div>
                )}
            </div>
            <div className="absolute bottom-16 left-4 text-white p-2" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                <p className="font-bold">{reel.author}</p>
                <p className="text-sm">{reel.description}</p>
            </div>
            <div className="absolute bottom-16 right-2 flex flex-col items-center gap-4 text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                <button onClick={() => setLiked(!liked)} className="flex flex-col items-center">
                    <HeartIcon className={`w-8 h-8 transition-colors ${liked ? 'text-red-500' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'}/>
                    <span className="text-xs font-semibold">1.2M</span>
                </button>
                <button className="flex flex-col items-center">
                    <CommentIcon className="w-8 h-8" />
                    <span className="text-xs font-semibold">3.4K</span>
                </button>
                <button className="flex flex-col items-center">
                    <ShareIcon className="w-8 h-8" />
                    <span className="text-xs font-semibold">Share</span>
                </button>
            </div>
        </div>
    );
};

const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [visibleReelId, setVisibleReelId] = useState<string | null>(INITIAL_REELS.length > 0 ? INITIAL_REELS[0].id : null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newReel: Reel = {
        id: new Date().toISOString(),
        url: URL.createObjectURL(file),
        author: '@me',
        description: 'My new reel!',
      };
      setReels(prevReels => [...prevReels, newReel]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisibleReelId(entry.target.getAttribute('data-reel-id'));
                }
            });
        },
        { threshold: 0.5 }
    );

    const reelsElements = containerRef.current?.children;
    if (reelsElements) {
        Array.from(reelsElements).forEach(el => observer.observe(el));
    }

    return () => {
        if (reelsElements) {
            Array.from(reelsElements).forEach(el => observer.unobserve(el));
        }
    };
}, [reels]);


  return (
    <div className="h-full w-full bg-black relative">
       <div ref={containerRef} className="h-full w-full snap-y snap-mandatory overflow-y-auto">
        {reels.map(reel => (
          <div key={reel.id} data-reel-id={reel.id} className="h-full w-full">
            <ReelItem reel={reel} isVisible={visibleReelId === reel.id} />
          </div>
        ))}
      </div>
       <button
        onClick={triggerFileUpload}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors z-10"
      >
        <UploadIcon className="h-6 w-6 text-white" />
      </button>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default Reels;