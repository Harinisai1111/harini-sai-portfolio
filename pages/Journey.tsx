import React, { useEffect, useState } from 'react';
import { JOURNEY_DATA } from '../constants';
import { fetchProfileReadme, fetchUserProfile } from '../services/profileService';
import { marked } from 'marked';
import AboutModal from '../components/AboutModal';
import { BookOpen } from 'lucide-react';

const Journey: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [readmeHtml, setReadmeHtml] = useState<string>('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchUserProfile(),
      fetchProfileReadme()
    ]).then(([profileData, readmeData]) => {
      setProfile(profileData);

      // Pass raw markdown to modal for token analysis
      if (readmeData) {
        setReadmeHtml(readmeData);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-40 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Profile */}
        <header className="mb-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic text-white">Harini Sai: The Genesis</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
              A chronological documentary exploring the evolution of a software engineer,
              from early explorations to high-scale architectural design.
            </p>
          </div>

          {/* Profile Stats & About Button */}
          <div className="flex flex-col items-center gap-6">
            {profile && (
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-full text-neutral-400">
                  📦 <span className="font-bold text-white">{profile.repositories}</span> repos
                </span>
                <span className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-full text-neutral-400">
                  👥 <span className="font-bold text-white">{profile.followers}</span> followers
                </span>
                <span className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-full text-neutral-400">
                  🔗 <span className="font-bold text-white">{profile.following}</span> following
                </span>
              </div>
            )}

            {readmeHtml && (
              <button
                onClick={() => setIsAboutOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-red-900/20"
              >
                <BookOpen size={20} />
                Read Full Story
              </button>
            )}
          </div>
        </header>

        {/* Journey Timeline */}
        <div>
          <h2 className="text-3xl font-black mb-12 text-white uppercase tracking-tight">🎯 My Journey</h2>
          <div className="relative space-y-24 before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-neutral-800">
            {JOURNEY_DATA.map((item, idx) => (
              <div key={idx} className="relative pl-24 group">
                {/* Dot */}
                <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-red-600 border-4 border-neutral-950 z-10 group-hover:scale-125 transition-transform" />

                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="text-3xl font-bold tracking-tight text-white">{item.title}</h3>
                    <span className="text-red-600 font-mono font-bold text-sm tracking-widest">{item.duration}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-neutral-300 font-semibold">{item.organization}</span>
                    <span className="text-neutral-600">|</span>
                    <div className="flex gap-2">
                      {item.focus.map((f, fidx) => (
                        <span key={fidx} className="bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 relative overflow-hidden group-hover:bg-neutral-900 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="text-8xl font-black">{idx + 1}</span>
                    </div>
                    <p className="text-neutral-400 text-lg leading-relaxed relative z-10 italic">
                      "{item.description}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        content={readmeHtml}
      />
    </div>
  );
};

export default Journey;
