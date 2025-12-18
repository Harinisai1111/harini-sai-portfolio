
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectRowProps {
  title: string;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ title, projects, onProjectClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const amount = clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative py-8 group/row"
    >
      <h3 className="text-2xl font-black px-6 md:px-20 mb-6 tracking-tight text-neutral-400 group-hover/row:text-white transition-colors uppercase italic">{title}</h3>
      
      <div className="relative px-6 md:px-20">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-0 bottom-0 z-30 w-16 flex items-center justify-center bg-black/60 hover:bg-black/80 transition-all cursor-pointer no-print"
            >
              <ChevronLeft size={48} color="white" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showRightArrow && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-30 w-16 flex items-center justify-center bg-black/60 hover:bg-black/80 transition-all cursor-pointer no-print"
            >
              <ChevronRight size={48} color="white" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth p-2"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              onClick={() => onProjectClick(project)}
              whileHover={{ 
                scale: 1.05,
                zIndex: 20,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex-none w-72 md:w-96 aspect-video relative rounded-lg overflow-hidden cursor-pointer shadow-2xl border border-white/5 bg-neutral-900 group"
            >
              <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded-sm text-white font-black uppercase tracking-tighter">
                    {project.status === 'Active' ? 'Trending' : project.status}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{project.language}</span>
                </div>
                <h4 className="font-black text-white text-2xl tracking-tighter uppercase italic leading-none">{project.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectRow;
