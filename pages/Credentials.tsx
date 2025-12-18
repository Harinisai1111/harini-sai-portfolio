import React, { useState } from 'react';
import { CREDENTIALS_DATA } from '../constants';

const Credentials: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-40 px-6 md:px-20">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase italic tracking-tighter text-white">Official Documentation</h1>
          <p className="text-xl text-neutral-400 font-medium max-w-2xl">Verified credentials and industry certifications validation.</p>
        </header>

        <div className="space-y-8">
          {CREDENTIALS_DATA.map((cred) => (
            <div key={cred.id} className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-600 transition-colors flex flex-col md:flex-row h-auto md:h-[280px]">
              {/* Image Section */}
              <button
                onClick={() => setSelectedImage(cred.image)}
                className="w-full md:w-1/3 lg:w-1/4 relative overflow-hidden cursor-zoom-in focus:outline-none"
              >
                <img src={cred.image} alt={cred.title} className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900/50 md:to-neutral-900 opacity-60 group-hover:opacity-0 transition-opacity" />

                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  View Certificate
                </div>
              </button>

              {/* Content Section */}
              <div className="flex-1 p-8 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 p-6 opacity-10 md:opacity-100 transition-opacity">
                  <span className="text-6xl md:text-8xl font-black text-white/5 select-none">{cred.year}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">{cred.title}</h3>
                  <p className="text-red-500 font-bold mb-6">{cred.issuer}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Strategic Value</p>
                      <p className="text-neutral-300 text-sm leading-relaxed">{cred.importance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Practical Application</p>
                      <p className="text-neutral-300 text-sm leading-relaxed">{cred.application}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-6xl aspect-[1.414/1] md:aspect-[16/10] flex items-center justify-center bg-neutral-900 rounded-[2rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 group">
            <img
              src={selectedImage}
              alt="Credential Preview"
              className="w-full h-full object-contain p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close Button Inside Modal for cleaner look */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-red-500/80 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/50 pointer-events-none">
              Verified Legal Documentation
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credentials;
