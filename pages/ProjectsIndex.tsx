
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortAsc, LayoutGrid } from 'lucide-react';
import { Project } from '../types';
import { fetchProjects } from '../services/githubService';

interface ProjectsIndexProps {
  onProjectSelect: (project: Project) => void;
}

const ProjectsIndex: React.FC<ProjectsIndexProps> = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('Recently Updated');

  useEffect(() => {
    async function load() {
      const data = await fetchProjects();
      setProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    let result = [...projects];
    if (activeFilter !== 'All') {
      result = result.filter(p => p.category === activeFilter);
    }

    if (activeSort === 'Recently Updated') {
      result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (activeSort === 'Most Complex') {
      result.sort((a, b) => b.stargazers_count - a.stargazers_count);
    }

    setFilteredProjects(result);
  }, [activeFilter, activeSort, projects]);

  const categories = ['All', 'Backend', 'Frontend'];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-40 px-6 md:px-20">
      <header className="mb-16 space-y-8">
        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">Project Library</h1>

        <div className="flex flex-wrap items-center justify-between gap-8 border-b border-neutral-900 pb-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-sm font-black uppercase italic tracking-widest transition-all whitespace-nowrap ${activeFilter === cat ? 'text-white border-b-2 border-red-600' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-500 bg-neutral-900 px-4 py-2 rounded-md border border-white/5">
              <SortAsc size={16} />
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-black uppercase italic tracking-widest cursor-pointer text-neutral-300"
              >
                <option value="Recently Updated">Recently Updated</option>
                <option value="Most Complex">Complexity Index</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => onProjectSelect(project)}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden border border-white/5 bg-neutral-900 shadow-xl group-hover:scale-[1.02] transition-transform">
                <img src={project.coverImage} className="w-full h-full object-cover transition-all duration-700 brightness-75 group-hover:brightness-100 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] bg-red-600 px-1.5 py-0.5 rounded-sm text-white font-black uppercase tracking-tighter italic">Top 10 Build</span>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{project.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{project.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectsIndex;
