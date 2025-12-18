
import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { Play, Info } from 'lucide-react';

interface HeroProps {
  featuredProject: Project;
  onViewProject: (project: Project) => void;
  onViewJourney: () => void;
}

const Hero: React.FC<HeroProps> = ({ featuredProject, onViewProject, onViewJourney }) => {
  return (
    <div className="relative w-full h-[90vh] md:h-[95vh] overflow-hidden bg-neutral-900">
      {/* Background Image with Parallax-like feel */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src={featuredProject.coverImage} 
          alt={featuredProject.name}
          className="w-full h-full object-cover brightness-[0.3]"
        />
      </motion.div>
      
      {/* Gradients */}
      <div className="absolute inset-0 cinematic-gradient" />
      <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 max-w-4xl gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white text-[12px] font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase">Currently Building</span>
            <span className="text-neutral-300 text-xs font-bold uppercase tracking-[0.2em]">{featuredProject.category}</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter drop-shadow-2xl leading-[0.9]">
            {featuredProject.name}
          </h2>
        </motion.div>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-2xl text-neutral-300 max-w-2xl leading-relaxed font-medium"
        >
          {featuredProject.description}
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-wrap items-center gap-4 mt-4"
        >
          <button 
            onClick={() => onViewProject(featuredProject)}
            className="flex items-center gap-3 bg-white text-black px-10 py-3.5 rounded-md font-bold text-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-lg group"
          >
            <Play fill="black" size={24} />
            View Project
          </button>
          
          <button 
            onClick={onViewJourney}
            className="flex items-center gap-3 bg-neutral-500/30 text-white px-10 py-3.5 rounded-md font-bold text-xl hover:bg-neutral-500/50 transition-all active:scale-95 backdrop-blur-md border border-white/10"
          >
            <Info size={24} />
            View Journey
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
