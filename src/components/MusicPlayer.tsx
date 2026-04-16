import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { DUMMY_TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    setIsPlaying(true);
  };

  return (
    <div className="brutal-border p-6 bg-void w-full max-w-[320px] screen-tear">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />
      
      <div className="relative aspect-square mb-6 border-2 border-glitch-magenta overflow-hidden">
        <motion.img
          key={currentTrack.id}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-full h-full object-cover grayscale contrast-150"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-glitch-magenta/20 mix-blend-overlay" />
      </div>

      <div className="mb-6 border-l-4 border-glitch-cyan pl-4">
        <h3 className="text-xl font-pixel text-glitch-cyan tracking-tighter truncate uppercase glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
        <p className="text-[10px] font-pixel text-glitch-magenta uppercase tracking-widest mt-1">SRC: {currentTrack.artist}</p>
      </div>

      <div className="space-y-6">
        <div className="relative h-4 bg-glitch-cyan/10 border border-glitch-cyan">
          <motion.div
            className="absolute top-0 left-0 h-full bg-glitch-magenta"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-pixel text-white mix-blend-difference">
            STREAM_BUFFER: {Math.floor(progress)}%
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => handleSkip('prev')}
            className="p-2 text-glitch-cyan hover:text-glitch-magenta transition-colors"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 flex items-center justify-center bg-glitch-magenta text-void hover:bg-glitch-cyan transition-colors"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button
            onClick={() => handleSkip('next')}
            className="p-2 text-glitch-cyan hover:text-glitch-magenta transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-glitch-cyan/40 font-pixel text-[8px]">
          <Volume2 size={12} />
          <div className="flex-1 h-1 bg-glitch-cyan/10">
            <div className="w-2/3 h-full bg-glitch-cyan/40" />
          </div>
          <span>VOL_MAX</span>
        </div>
      </div>
    </div>
  );
};
