import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info, ExternalLink } from 'lucide-react';
import { FREELANCE_PROJECTS } from '../constants';

const Freelance: React.FC = () => {
    const featured = FREELANCE_PROJECTS[0];
    const others = FREELANCE_PROJECTS.slice(1);

    return (
        <div className="min-h-screen bg-neutral-950 pb-20">
            {/* Hero Section */}
            {featured && (
                <div className="relative h-[85vh] w-full">
                    <div className="absolute inset-0">
                        <img src={featured.image} alt={featured.title} className="w-full h-full object-cover brightness-[0.4]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-black/50 to-transparent" />
                    </div>

                    <div className="absolute bottom-32 left-6 md:left-20 max-w-2xl space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-red-600 font-black uppercase tracking-widest text-sm bg-black/50 backdrop-blur-md px-3 py-1 rounded-sm border border-red-600/30">
                                Freelance Original
                            </span>
                            <span className="text-neutral-400 font-bold uppercase tracking-widest text-sm">{featured.year}</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            {featured.title}
                        </h1>

                        <p className="text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-xl drop-shadow-lg drop-shadow-black">
                            {featured.description}
                        </p>

                        <div className="flex gap-4 pt-4">
                            <a
                                href={featured.link}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white text-black px-8 py-3 rounded-sm font-bold flex items-center gap-3 hover:bg-neutral-200 transition-colors uppercase tracking-tight text-lg shadow-xl"
                            >
                                <Play fill="currentColor" size={20} />
                                Live Demo
                            </a>
                            <button className="bg-neutral-600/60 text-white px-8 py-3 rounded-sm font-bold flex items-center gap-3 hover:bg-neutral-600/80 transition-colors uppercase tracking-tight text-lg backdrop-blur-md">
                                <Info size={24} />
                                More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Section */}
            <div className="px-6 md:px-20 -mt-20 relative z-10 space-y-10">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-6">Client Success Stories</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {others.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            whileHover={{ scale: 1.05, zIndex: 20 }}
                            transition={{ duration: 0.3 }}
                            className="group relative h-[300px] bg-neutral-900 rounded-lg overflow-hidden cursor-pointer shadow-xl border border-white/5"
                        >
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-all duration-500 brightness-75 group-hover:brightness-100" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">
                                        {project.technologies[0]}
                                    </span>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">• {project.year}</span>
                                </div>

                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
                                    {project.title}
                                </h3>

                                <p className="text-xs text-neutral-300 line-clamp-2 mb-4 font-medium">
                                    {project.description}
                                </p>

                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="self-start bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-white/10"
                                >
                                    <ExternalLink size={12} />
                                    Visit Site
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Freelance;
