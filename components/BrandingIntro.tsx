
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface BrandingIntroProps {
  onComplete: () => void;
}

const BrandingIntro: React.FC<BrandingIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'initial' | 'streak' | 'split' | 'resolve'>('initial');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    // Increased durations for a more cinematic experience
    const timers = [
      setTimeout(() => setStage('streak'), 800),
      setTimeout(() => setStage('split'), 1800),
      setTimeout(() => setStage('resolve'), 3200),
      setTimeout(() => onComplete(), 5500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  // Generate "strands" for the Netflix-style splitting effect
  const strands = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    delay: i * 0.04,
    xOffset: (i - 8.5) * 12, // Spread them out
    height: 120 + Math.random() * 140,
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] bg-neutral-950 flex items-center justify-center overflow-hidden"
    >
      {/* Skip Option */}
      <button
        onClick={onComplete}
        className="absolute top-8 right-8 text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors z-[210] outline-none"
      >
        Skip Intro
      </button>

      <div className="relative flex items-center justify-center w-full h-full">
        {/* Stage 1 & 2: The Monogram 'H' with Light Streak */}
        <AnimatePresence>
          {(stage === 'initial' || stage === 'streak') && (
            <motion.div
              key="monogram"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <span className="text-red-600 text-[14rem] md:text-[22rem] font-netflix italic tracking-tighter select-none leading-none">
                H
              </span>
              
              {stage === 'streak' && (
                <motion.div
                  initial={{ x: '-250%', skewX: -30, opacity: 0 }}
                  animate={{ x: '250%', skewX: -30, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-xl"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 3: The Netflix Split into Strands */}
        <AnimatePresence>
          {stage === 'split' && (
            <motion.div 
              key="split-container"
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0 }}
            >
              <div className="relative flex items-center justify-center">
                {strands.map((strand) => (
                  <motion.div
                    key={strand.id}
                    initial={{ height: 0, opacity: 0, y: 0 }}
                    animate={{ 
                      height: strand.height, 
                      opacity: [0, 1, 1, 0],
                      x: strand.xOffset * 1.8,
                      scaleY: [1, 1.4, 0.7, 1],
                    }}
                    transition={{ 
                      duration: 1.4, 
                      delay: strand.delay,
                      ease: "circOut"
                    }}
                    className="absolute w-1 md:w-2 bg-red-600 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.9)]"
                    style={{ left: '50%' }}
                  />
                ))}
                {/* Secondary bloom light */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 6, opacity: [0, 0.4, 0] }}
                  transition={{ duration: 1.2 }}
                  className="absolute w-32 h-32 bg-red-600 rounded-full blur-[100px]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 4: Final Resolve into "Harini Sai" Logo */}
        <AnimatePresence>
          {stage === 'resolve' && (
            <motion.div
              key="name-resolve"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ letterSpacing: '2em', opacity: 0 }}
                animate={{ letterSpacing: '0.1em', opacity: 1 }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div className="logo-arc !text-6xl md:!text-9xl !text-white drop-shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                  HARINI <span className="text-red-600">SAI</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '140%', opacity: 1 }}
                transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                className="h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent mt-12"
              />
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 1 }}
                className="mt-10 text-neutral-400 font-netflix tracking-[0.8em] text-sm md:text-xl uppercase"
              >
                Software Engineering Student
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deep Cinematic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.03),rgba(0,0,255,0.08))] z-[205] bg-[length:100%_2px,3px_100%]" />
      </div>
    </motion.div>
  );
};

export default BrandingIntro;
