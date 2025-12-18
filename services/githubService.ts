
import { supabase } from '../lib/supabase/client';
import { Project, Commit, Season, Episode } from '../types';

/**
 * Fetch all projects from Supabase with seasons, episodes, and commits
 */
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      seasons (
        *,
        episodes (
          *,
          commits (*)
        )
      )
    `)
    .order('last_synced_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.warn('No projects found in database. Run sync to populate data.');
    return [];
  }

  // Transform database format to frontend format
  const projects: Project[] = await Promise.all(
    data.map(async (project) => {
      // Use cover_image from database (already set during sync)
      const coverImage = project.cover_image || project.social_preview_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070';

      // Transform seasons
      const seasons: Season[] = (project.seasons || []).map((season: any) => ({
        number: season.number,
        title: season.title,
        episodes: (season.episodes || []).map((episode: any) => ({
          title: episode.title,
          dateRange: episode.date_range || '',
          description: episode.description || '',
          commits: (episode.commits || []).map((commit: any) => ({
            sha: commit.sha,
            message: commit.message,
            date: new Date(commit.committed_at).toISOString().split('T')[0],
            author: commit.author || 'Unknown',
          })),
        })),
      }));

      return {
        id: project.github_id,
        name: project.name,
        description: project.description || '',
        stargazers_count: project.stargazers_count,
        language: project.language || 'Unknown',
        updated_at: project.last_synced_at || project.updated_at,
        html_url: project.html_url,
        homepage: project.homepage,
        topics: project.topics || [],
        coverImage,
        status: project.status as 'Active' | 'Paused' | 'Archived',
        category: project.category || 'Other',
        readme: project.readme,
        created_at: project.created_at,
        seasons,
      };
    })
  );

  return projects;
}

/**
 * Fetch a single project by slug
 */
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      seasons (
        *,
        episodes (
          *,
          commits (*)
        )
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return null;
  }

  if (!data) return null;

  // Use cover_image from database (already set during sync)
  const coverImage = data.cover_image || data.social_preview_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070';

  // Transform seasons
  const seasons: Season[] = (data.seasons || []).map((season: any) => ({
    number: season.number,
    title: season.title,
    episodes: (season.episodes || []).map((episode: any) => ({
      title: episode.title,
      dateRange: episode.date_range || '',
      description: episode.description || '',
      commits: (episode.commits || []).map((commit: any) => ({
        sha: commit.sha,
        message: commit.message,
        date: new Date(commit.committed_at).toISOString().split('T')[0],
        author: commit.author || 'Unknown',
      })),
    })),
  }));

  return {
    id: data.github_id,
    name: data.name,
    description: data.description || '',
    stargazers_count: data.stargazers_count,
    language: data.language || 'Unknown',
    updated_at: data.last_synced_at || data.updated_at,
    html_url: data.html_url,
    homepage: data.homepage,
    topics: data.topics || [],
    coverImage,
    status: data.status as 'Active' | 'Paused' | 'Archived',
    category: data.category || 'Other',
    readme: data.readme,
    created_at: data.created_at,
    seasons,
  };
}

/**
 * Subscribe to real-time project updates
 */
export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const channel = supabase
    .channel('projects-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      async () => {
        const projects = await fetchProjects();
        callback(projects);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use fetchProjects instead
 */
export async function fetchCommits(repoName: string): Promise<Commit[]> {
  console.warn('fetchCommits is deprecated. Commits are now fetched with projects.');
  return [];
}
