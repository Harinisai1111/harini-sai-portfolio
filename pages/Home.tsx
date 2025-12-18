
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProjectRow from '../components/ProjectRow';
import TopTenRow from '../components/TopTenRow';
import { Project } from '../types';
import { fetchProjects } from '../services/githubService';

interface HomeProps {
  onProjectSelect: (project: Project) => void;
  onNavigate: (path: string) => void;
}

const Home: React.FC<HomeProps> = ({ onProjectSelect, onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || projects.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-950">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const featured = projects[0];
  const backend = projects.filter(p => p.category === 'Backend');
  const frontend = projects.filter(p => p.category === 'Frontend');

  // Get 10 most recent repos sorted by last update
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  return (
    <div className="pb-20">
      <Hero
        featuredProject={featured}
        onViewProject={onProjectSelect}
        onViewJourney={() => onNavigate('/journey')}
      />

      <div className="relative -mt-32 z-20 space-y-4">
        {/* Top 10 Most Recent Repos */}
        <TopTenRow title="Top 10 Recent Builds" projects={recentProjects} onProjectClick={onProjectSelect} />

        <ProjectRow title="Backend Applications" projects={backend} onProjectClick={onProjectSelect} />
        <ProjectRow title="Frontend Artistry" projects={frontend} onProjectClick={onProjectSelect} />
        <ProjectRow title="Development Archives" projects={projects} onProjectClick={onProjectSelect} />
      </div>
    </div>
  );
};

export default Home;
