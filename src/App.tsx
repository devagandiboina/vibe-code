import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden selection:bg-glitch-magenta selection:text-white">
      {/* CRT & Glitch Overlays */}
      <div className="crt-overlay" />
      <div className="scanline" />
      
      <header className="relative z-10 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4 mb-2">
            <Cpu className="text-glitch-magenta animate-pulse" size={32} />
            <h1 
              className="text-5xl md:text-7xl font-pixel font-bold tracking-tighter uppercase glitch-text"
              data-text="VOID_RHYTHM"
            >
              VOID_RHYTHM
            </h1>
          </div>
          <div className="bg-glitch-cyan text-void px-4 py-1 font-pixel text-[10px] uppercase tracking-[0.2em]">
            SYSTEM_VERSION: 0.4.2-BETA // STATUS: UNSTABLE
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-start">
        {/* Left Sidebar - System Logs */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex flex-col gap-8"
        >
          <div className="brutal-border p-6 bg-void/80 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 text-glitch-cyan border-b border-glitch-cyan pb-2">
              <Terminal size={18} />
              <h2 className="font-pixel text-[10px] uppercase tracking-widest">CMD_INPUT</h2>
            </div>
            <div className="space-y-4 font-terminal text-lg uppercase tracking-wider text-glitch-cyan/70">
              <p className="flex justify-between border-b border-glitch-cyan/10 pb-1">
                <span>[MOVE]</span> <span className="text-glitch-magenta">_NAV_KEYS</span>
              </p>
              <p className="flex justify-between border-b border-glitch-cyan/10 pb-1">
                <span>[HALT]</span> <span className="text-glitch-magenta">_SPACE_BAR</span>
              </p>
              <p className="flex justify-between border-b border-glitch-cyan/10 pb-1">
                <span>[SYNC]</span> <span className="text-glitch-magenta">_AUTO_BEAT</span>
              </p>
            </div>
          </div>

          <div className="brutal-border p-6 bg-void/80 backdrop-blur-md border-glitch-magenta shadow-[8px_8px_0px_var(--color-glitch-cyan)]">
            <div className="flex items-center gap-3 mb-6 text-glitch-magenta border-b border-glitch-magenta pb-2">
              <Activity size={18} />
              <h2 className="font-pixel text-[10px] uppercase tracking-widest">SYS_INTEL</h2>
            </div>
            <p className="font-terminal text-lg leading-tight text-glitch-magenta/80">
              CORE_PROCESS: HARVESTING DATA NODES. 
              WARNING: PROLONGED EXPOSURE TO VOID_FREQUENCIES MAY CAUSE TEMPORAL DRIFT.
            </p>
          </div>
        </motion.div>

        {/* Center - The Void (Snake) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Sidebar - Audio Stream */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center lg:justify-end"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      <footer className="relative z-10 mt-20 w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t-2 border-glitch-cyan/20 pt-8">
          <div className="flex gap-8 font-pixel text-[8px] uppercase text-glitch-cyan/30">
            <span>MEM_LEAK: DETECTED</span>
            <span>ENCRYPTION: NONE</span>
            <span>USER: UNKNOWN</span>
          </div>
          <p className="text-[10px] font-pixel uppercase tracking-widest text-glitch-magenta/40">
            [TERMINAL_END] // NO_EXIT_FOUND
          </p>
        </div>
      </footer>
    </div>
  );
}
