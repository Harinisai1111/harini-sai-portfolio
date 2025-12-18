// Full sync script with commits, episodes, seasons, README and createdAt
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { graphql } from '@octokit/graphql';

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN!;
const GITHUB_USERNAME = 'Harinisai1111';
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${GITHUB_TOKEN}` },
});

console.log('🚀 Starting full GitHub sync (AI Imagery + README + Creation Date)...\n');

// AI Curated Mapping
const CURATED_IMAGES: Record<string, string> = {
  'diabetes-ai-assistant': 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=2070',
  'flappy-bird': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
  'simple-spends-log': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070',
  'lumo': 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070',
  'blogspace': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
  'dragrun': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=2070',
  'dragrun_swing': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=2070',
  'vector': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2070',
  'culina': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070',
  'learn_forge': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2070',
  'shastra_webpage': 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=2070',
  'aesthetic_calendar': 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2070',
  'linkverse-zen-connect': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
  'brew-haven-caf-': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=2070',
  'harinisai1111': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
};

// ... (rest of the full sync logic updated with createdAt)
const reposQuery = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}, isFork: false, privacy: PUBLIC) {
        nodes {
          databaseId
          name
          description
          url
          homepageUrl
          stargazerCount
          primaryLanguage { name }
          repositoryTopics(first: 10) {
            nodes { topic { name } }
          }
          pushedAt
          updatedAt
          createdAt
          openGraphImageUrl
          usesCustomOpenGraphImage
          isArchived
          isPrivate
          object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
`;

// Fetch commits for a repo
async function fetchCommits(repoName: string): Promise<any[]> {
  const commitsQuery = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 50) {
                nodes {
                  oid
                  message
                  committedDate
                  author {
                    name
                    email
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const result: any = await graphqlWithAuth(commitsQuery, {
      owner: GITHUB_USERNAME,
      repo: repoName,
    });

    return result.repository?.defaultBranchRef?.target?.history?.nodes || [];
  } catch (error) {
    return [];
  }
}

function groupCommitsIntoEpisodes(commits: any[]): any[] {
  if (commits.length === 0) return [];
  const episodes: any[] = [];
  let currentEpisode: any[] = [];
  commits.forEach((commit, index) => {
    currentEpisode.push(commit);
    if (currentEpisode.length >= 5 || index === commits.length - 1) {
      const startDate = currentEpisode[currentEpisode.length - 1].committedDate;
      const endDate = currentEpisode[0].committedDate;
      episodes.push({
        title: `Development Sprint ${episodes.length + 1}`,
        description: `${currentEpisode.length} commits`,
        startDate,
        endDate,
        dateRange: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
        commits: currentEpisode,
        commitCount: currentEpisode.length,
      });
      currentEpisode = [];
    }
  });
  return episodes;
}

function determineCategory(repo: any): string {
  if (repo.homepageUrl && repo.homepageUrl.trim().length > 0) return 'Backend';
  return 'Frontend';
}

function generateCoverImage(language: string | null, repoName: string, description: string | null): string {
  const name = repoName.toLowerCase();
  if (CURATED_IMAGES[name]) return CURATED_IMAGES[name];
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070';
}

// Main sync
graphqlWithAuth(reposQuery, { username: GITHUB_USERNAME })
  .then(async (result: any) => {
    const repos = result.user.repositories.nodes.filter((r: any) => !r.isPrivate);
    console.log(`📦 Found ${repos.length} public repositories\n`);

    for (const repo of repos) {
      try {
        const coverImage = repo.usesCustomOpenGraphImage
          ? repo.openGraphImageUrl
          : generateCoverImage(repo.primaryLanguage?.name, repo.name, repo.description);

        const { data: project } = await supabase
          .from('projects')
          .upsert({
            github_id: repo.databaseId,
            name: repo.name,
            slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: repo.description,
            html_url: repo.url,
            homepage: repo.homepageUrl,
            stargazers_count: repo.stargazerCount,
            language: repo.primaryLanguage?.name || null,
            topics: repo.repositoryTopics.nodes.map((t: any) => t.topic.name),
            social_preview_url: repo.openGraphImageUrl,
            cover_image: coverImage,
            status: repo.isArchived ? 'Archived' : 'Active',
            category: determineCategory(repo),
            last_synced_at: repo.pushedAt || repo.updatedAt,
            readme: repo.object?.text || null,
            created_at: repo.createdAt,
          }, { onConflict: 'github_id' })
          .select().single();

        if (!project) continue;

        // Full sync also updates episodes
        const commits = await fetchCommits(repo.name);
        if (commits.length > 0) {
          const episodes = groupCommitsIntoEpisodes(commits);
          await supabase.from('seasons').delete().eq('project_id', project.id);
          const { data: season } = await supabase.from('seasons').insert({ project_id: project.id, number: 1, title: 'Season 1' }).select().single();
          if (season) {
            for (const ep of episodes) {
              const { data: epData } = await supabase.from('episodes').insert({
                season_id: season.id, project_id: project.id, title: ep.title, description: ep.description,
                date_range: ep.dateRange, start_date: ep.startDate, end_date: ep.endDate, commit_count: ep.commitCount
              }).select().single();
              if (epData) {
                const commitInserts = ep.commits.map((c: any) => ({
                  episode_id: epData.id, project_id: project.id, sha: c.oid, message: c.message,
                  author: c.author?.name || 'Unknown', committed_at: c.committedDate
                }));
                await supabase.from('commits').insert(commitInserts);
              }
            }
          }
        }
        console.log(`✅ Synced: ${repo.name}`);
      } catch (err: any) {
        console.error(`❌ ${repo.name}: ${err.message}`);
      }
    }
    process.exit(0);
  });
