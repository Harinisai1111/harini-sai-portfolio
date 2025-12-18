
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Github, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Project, Episode } from '../types';
import AboutModal from '../components/AboutModal';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const [activeSeason, setActiveSeason] = useState(0);
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-6xl h-full max-h-[90vh] overflow-y-auto bg-neutral-950 rounded-2xl shadow-2xl no-scrollbar border border-white/10 z-[120]"
      >
        {/* Fixed Close Button inside Modal */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[130] p-2 bg-black/50 backdrop-blur-xl rounded-full hover:bg-neutral-800 transition-colors border border-white/20 text-white shadow-lg group"
        >
          <X size={24} className="group-hover:scale-110 transition-transform" />
        </button>

        <div className="w-full">
          {/* Banner Section */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover brightness-[0.5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

            <div className="absolute bottom-10 left-6 md:left-12 right-6 space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] text-white">{project.name}</h1>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-green-500 font-black uppercase tracking-widest text-[10px] md:text-xs">New Episode Available</span>
                  <span className="text-neutral-400 font-bold text-xs">{new Date(project.created_at).getFullYear()}</span>
                  <span className="border border-neutral-600 px-2 rounded text-[9px] text-neutral-300 font-bold tracking-widest">SYSTEMS-13</span>
                  <span className="text-neutral-400 font-bold text-xs uppercase">{project.language}</span>
                </div>

                <p className="text-neutral-300 text-base md:text-xl max-w-2xl leading-relaxed font-medium italic">
                  {project.description}
                </p>

                <div className="flex gap-3 pt-4">
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-black px-6 py-2 rounded-sm font-black flex items-center gap-2 hover:bg-neutral-200 transition-all uppercase italic text-sm shadow-lg active:scale-95"
                  >
                    <Github size={18} />
                    Source Files
                  </a>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-neutral-800 text-white px-6 py-2 rounded-sm font-black flex items-center gap-2 hover:bg-neutral-700 transition-all uppercase italic text-sm backdrop-blur-md border border-white/10 active:scale-95"
                    >
                      <ExternalLink size={18} />
                      Live Preview
                    </a>
                  )}
                  {project.readme && (
                    <button
                      onClick={() => setIsReadmeOpen(true)}
                      className="bg-red-600 border border-red-500 text-white px-6 py-2 rounded-sm font-black flex items-center gap-2 hover:bg-red-700 transition-all uppercase italic text-sm shadow-xl shadow-red-900/20 active:scale-95 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <FileText size={18} />
                      Read Specs
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 md:px-12 py-12">
            <div className="lg:col-span-2 space-y-10">
              {/* Seasons/Episodes Navigation */}
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-neutral-900 pb-4">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Production Timeline</h2>
                  {project.seasons.length > 0 && (
                    <div className="flex gap-2">
                      {project.seasons.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSeason(i)}
                          className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase italic transition-all border ${activeSeason === i ? 'bg-white text-black border-white shadow-lg' : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600'}`}
                        >
                          Season {s.number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {project.seasons[activeSeason]?.episodes.length > 0 ? (
                    project.seasons[activeSeason].episodes.map((episode, idx) => (
                      <EpisodeCard key={idx} episode={episode} index={idx + 1} />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800 flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-neutral-800 border-t-red-600 animate-spin" />
                      <p className="text-neutral-500 font-black uppercase italic tracking-widest text-[10px]">Synthesizing Metadata...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-neutral-600 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Cast & Crew</h3>
                <div className="space-y-2">
                  <div className="text-neutral-300 text-xs font-bold"><span className="text-neutral-500 font-medium">Architect:</span> Harini Sai</div>
                  <div className="text-neutral-300 text-xs font-bold"><span className="text-neutral-500 font-medium">Key Technologies:</span> {[project.language, ...project.topics].filter(t => t && t !== 'No language').join(', ')}</div>
                  <div className="text-neutral-300 text-xs font-bold"><span className="text-neutral-500 font-medium">Original Release:</span> {new Date(project.created_at).getFullYear()}</div>
                </div>
              </div>

              <div>
                <h3 className="text-neutral-600 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Technical Specs</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.language && project.language !== 'No language' && (
                    <span className="bg-red-900/20 border border-red-900/50 text-red-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{project.language}</span>
                  )}
                  {project.topics.map((t) => (
                    <span key={t} className="bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AboutModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
        content={project.readme || ''}
      />
    </div>
  );
};

const EpisodeCard: React.FC<{ episode: Episode; index: number }> = ({ episode, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-neutral-900/30 rounded-lg overflow-hidden border border-white/5 hover:bg-neutral-900/50 transition-colors group">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-6 p-5 cursor-pointer"
      >
        <div className="text-neutral-700 font-black text-3xl w-8 group-hover:text-red-600 transition-colors italic">{index}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="text-lg font-black uppercase italic tracking-tight text-white">{episode.title}</h3>
            <span className="text-[10px] font-bold text-neutral-500">{episode.dateRange}</span>
          </div>
          <p className="text-neutral-400 text-xs font-medium line-clamp-1">
            {episode.description}
          </p>
        </div>
        <div className="text-neutral-500">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5 bg-neutral-950/20"
          >
            <div className="p-6 space-y-6">
              <p className="text-neutral-300 text-sm leading-relaxed font-medium italic">
                {episode.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-neutral-600 text-[9px] font-black uppercase tracking-[0.3em]">Code Artifacts</h4>
                <div className="grid gap-2">
                  {episode.commits.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-neutral-950 p-3 rounded border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-200">{c.message}</span>
                        <span className="text-[9px] font-mono text-neutral-600 uppercase">{c.date}</span>
                      </div>
                      <span className="font-mono text-[9px] bg-neutral-900 text-neutral-500 px-2 py-0.5 rounded border border-white/5">
                        {c.sha.substring(0, 7)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
