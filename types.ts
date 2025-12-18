
export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
  html_url: string;
  homepage?: string;
  topics: string[];
  created_at: string;
}

export interface Commit {
  sha: string;
  message: string;
  date: string;
  author: string;
}

export interface Episode {
  title: string;
  dateRange: string;
  description: string;
  commits: Commit[];
}

export interface Season {
  number: number;
  title: string;
  episodes: Episode[];
}
export interface Project extends GitHubRepo {
  coverImage: string;
  status: 'Active' | 'Paused' | 'Archived';
  category: string;
  readme?: string | null;
  seasons: Season[];
}

export interface JourneyItem {
  type: 'Education' | 'Internship' | 'Origin' | 'Achievement';
  title: string;
  organization: string;
  duration: string;
  focus: string[];
  description: string;
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  year: string;
  importance: string;
  application: string;
  image: string;
}

export interface FreelanceProject {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  year: string;
  technologies: string[];
}
