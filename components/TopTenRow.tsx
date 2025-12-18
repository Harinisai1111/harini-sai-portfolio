
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface TopTenRowProps {
  title: string;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const TopTenRow: React.FC<TopTenRowProps> = ({ title, projects, onProjectClick }) => {
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
      className="relative py-12 group/row overflow-hidden"
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
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-8"
        >
          {projects.slice(0, 10).map((project, index) => (
            <motion.div 
              key={project.id}
              onClick={() => onProjectClick(project)}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex-none flex items-center relative h-[320px] w-[280px] md:w-[360px] cursor-pointer group pr-4"
            >
              {/* Large Outline Number - Netflix style behind the card */}
              <div className="absolute left-0 z-0 select-none pointer-events-none transform -translate-x-1/4">
                <span className="outline-number opacity-60 group-hover:opacity-100 transition-opacity">
                  {index + 1}
                </span>
              </div>
              
              {/* Poster Card - Shifted to provide space for number */}
              <div className="ml-24 md:ml-32 w-full h-full relative rounded-lg overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl z-10">
                <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-6">
                   <div className="bg-red-600 self-start text-[10px] px-2 py-1 rounded-sm text-white font-black uppercase mb-2 tracking-widest">
                     Recently Built
                   </div>
                   <h4 className="font-netflix text-white text-4xl tracking-tight leading-none truncate">{project.name}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TopTenRow;
