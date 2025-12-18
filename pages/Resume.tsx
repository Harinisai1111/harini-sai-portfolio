
import React, { useEffect, useState } from 'react';
import { JOURNEY_DATA, CREDENTIALS_DATA } from '../constants';
import { fetchProjects } from '../services/githubService';
import { fetchUserProfile } from '../services/profileService';
import { Project } from '../types';

const Resume: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchUserProfile()
    ]).then(([projectsData, profileData]) => {
      setProjects(projectsData);
      setProfile(profileData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get top projects by stars
  const topProjects = [...projects]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  // Get unique skills from all projects
  const allSkills = new Set<string>();
  projects.forEach(p => {
    if (p.language) allSkills.add(p.language);
    p.topics?.forEach(t => allSkills.add(t));
  });
  const skills = Array.from(allSkills).slice(0, 15);

  // Filter journey items by type
  const education = JOURNEY_DATA.filter(j => j.type === 'Education');
  const internships = JOURNEY_DATA.filter(j => j.type === 'Internship');
  const achievements = JOURNEY_DATA.filter(j => j.type === 'Achievement');

  return (
    <div className="min-h-screen bg-neutral-900 pt-32 pb-40 px-6">
      <div className="max-w-4xl mx-auto bg-white text-black p-12 md:p-20 shadow-2xl rounded-sm print:shadow-none">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-black pb-8 mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">{profile?.name || 'Harini Sai'}</h1>
            <p className="text-xl font-bold text-neutral-700 tracking-wide uppercase">Software Engineer</p>
            {profile?.bio && (
              <p className="text-sm text-neutral-600 mt-2 italic max-w-md">"{profile.bio}"</p>
            )}
          </div>
          <div className="text-right space-y-1">
            <p className="font-semibold text-sm">github.com/Harinisai1111</p>
            <p className="font-semibold text-sm">{profile?.repositories || 0} Public Repos</p>
            <p className="font-semibold text-sm">{profile?.followers || 0} GitHub Followers</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-10">
            {/* Experience / Internships */}
            {internships.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">Experience</h2>
                <div className="space-y-6">
                  {internships.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <span className="font-mono text-xs">{item.duration}</span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{item.organization}</p>
                      <p className="text-sm text-neutral-700 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.focus.map((f, fidx) => (
                          <span key={fidx} className="bg-neutral-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{f}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Projects */}
            <section>
              <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">Key Projects</h2>
              <div className="space-y-6">
                {topProjects.map((project, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{project.name} {project.language && `(${project.language})`}</h3>
                      <span className="text-xs text-neutral-600">⭐ {project.stargazers_count}</span>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {project.description || 'A software engineering project showcasing modern development practices.'}
                    </p>
                    {project.topics && project.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.topics.slice(0, 5).map((topic, tidx) => (
                          <span key={tidx} className="bg-neutral-100 px-2 py-0.5 rounded text-[9px] font-semibold">{topic}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            {achievements.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">Achievements</h2>
                <div className="space-y-3 text-sm">
                  {achievements.map((item, idx) => (
                    <div key={idx}>
                      <p className="font-bold">{item.title} - {item.organization}</p>
                      <p className="text-neutral-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">Education</h2>
                <div className="space-y-4">
                  {education.map((item, idx) => (
                    <div key={idx}>
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      <p className="text-xs text-neutral-600">{item.organization}</p>
                      <p className="text-xs text-neutral-600 italic">{item.duration}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            <section>
              <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s} className="bg-neutral-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{s}</span>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {CREDENTIALS_DATA.length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">Certifications</h2>
                <div className="space-y-3 text-xs">
                  {CREDENTIALS_DATA.map((cert, idx) => (
                    <div key={idx}>
                      <p className="font-bold">{cert.title}</p>
                      <p className="text-neutral-600">{cert.issuer} • {cert.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Stats */}
            <section>
              <h2 className="text-lg font-black uppercase border-b border-neutral-300 mb-4 tracking-widest">GitHub Stats</h2>
              <div className="space-y-2 text-xs">
                <p>• {projects.length} Public Projects</p>
                <p>• {projects.reduce((sum, p) => sum + p.stargazers_count, 0)} Total Stars</p>
                <p>• {skills.length}+ Technologies</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
          <p>This resume is auto-generated from live GitHub data • Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-12 flex justify-center no-print">
        <button
          onClick={() => window.print()}
          className="bg-red-600 text-white px-10 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-xl"
        >
          📄 Print / Download PDF
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Resume;
