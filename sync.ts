// Simplified sync script
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

console.log('🚀 Starting GitHub sync...\n');

// Fetch repositories (PUBLIC ONLY)
const query = `
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

// Comprehensive Curated Mapping (AI analyzed)
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

// Helper function to generate cover image based on AI analysis of name and description
function generateCoverImage(language: string | null, repoName: string, description: string | null): string {
  const name = repoName.toLowerCase();
  const desc = (description || '').toLowerCase();
  const lang = (language || '').toLowerCase();

  // 1. Check for specific curated matches
  if (CURATED_IMAGES[name]) return CURATED_IMAGES[name];

  // 2. Keyword-based AI analysis (high priority)
  if (name.includes('game') || name.includes('play') || desc.includes('game')) {
    return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2070'; // Gaming console
  }
  if (name.includes('ai') || name.includes('assistant') || desc.includes('artificial intelligence') || desc.includes('bot')) {
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070'; // AI/Neural
  }
  if (name.includes('finance') || name.includes('money') || desc.includes('expense') || desc.includes('budget')) {
    return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070'; // Money
  }
  if (name.includes('chat') || name.includes('message') || desc.includes('social')) {
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2070'; // Messaging
  }
  if (name.includes('fitness') || name.includes('gym') || desc.includes('workout') || desc.includes('health')) {
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2070'; // Gym
  }
  if (name.includes('recipe') || name.includes('food') || desc.includes('cooking') || desc.includes('meal')) {
    return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=2070'; // Food
  }

  // 3. Language-based stylized imagery fallback
  const languageImages: Record<string, string> = {
    'typescript': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=2070',
    'javascript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2070',
    'python': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=2070',
    'java': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070',
    'swift': 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=2070',
  };

  return languageImages[lang] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070';
}

// Helper to determine category
function determineCategory(repo: any, topics: string[]): string {
  const t = topics.map(s => s.toLowerCase());
  const hasDeploy = repo.homepageUrl && repo.homepageUrl.trim().length > 0;

  if (hasDeploy) {
    return 'Backend';
  }

  // Default to Frontend
  return 'Frontend';
}

graphqlWithAuth(query, { username: GITHUB_USERNAME })
  .then(async (result: any) => {
    const repos = result.user.repositories.nodes;

    // Filter out private repos (extra safety check)
    const publicRepos = repos.filter((repo: any) => !repo.isPrivate);

    // 1. Fetch all existing projects in DB to track what needs deletion
    const { data: existingProjects } = await supabase.from('projects').select('github_id');
    const existingIds = new Set((existingProjects || []).map(p => p.github_id));
    const syncedIds = new Set<number>();

    console.log(`📦 Found ${publicRepos.length} public repositories from GitHub\n`);

    let synced = 0;
    for (const repo of publicRepos) {
      try {
        syncedIds.add(repo.databaseId);

        // Determine cover image
        let coverImage = '';
        if (repo.openGraphImageUrl && repo.usesCustomOpenGraphImage) {
          // Use custom GitHub social preview
          coverImage = repo.openGraphImageUrl;
        } else {
          // Generate based on language and keywords
          coverImage = generateCoverImage(repo.primaryLanguage?.name, repo.name, repo.description);
        }

        // Determine category
        const topics = repo.repositoryTopics.nodes.map((t: any) => t.topic.name);
        const category = determineCategory(repo, topics);

        // Upsert project
        const { error } = await supabase.from('projects').upsert({
          github_id: repo.databaseId,
          name: repo.name,
          slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: repo.description,
          html_url: repo.url,
          homepage: repo.homepageUrl,
          stargazers_count: repo.stargazerCount,
          language: repo.primaryLanguage?.name || null,
          topics: topics,
          social_preview_url: repo.openGraphImageUrl,
          cover_image: coverImage,
          status: repo.isArchived ? 'Archived' : 'Active',
          category: category,
          updated_at: repo.pushedAt || repo.updatedAt,
          last_synced_at: repo.pushedAt || repo.updatedAt,
          readme: repo.object?.text || null,
          created_at: repo.createdAt,
        }, { onConflict: 'github_id' });

        if (error) {
          console.error(`❌ Failed to sync ${repo.name}:`, error.message);
        } else {
          synced++;
          console.log(`✅ Synced: ${repo.name} (${repo.primaryLanguage?.name || 'No language'})`);
        }
      } catch (err: any) {
        console.error(`❌ Error syncing ${repo.name}:`, err.message);
      }
    }

    // 2. Identify and DELETE private/removed repos
    const idsToDelete = [...existingIds].filter(id => !syncedIds.has(id));

    if (idsToDelete.length > 0) {
      console.log(`\n🗑️  Found ${idsToDelete.length} projects to remove (private or deleted)...`);
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .in('github_id', idsToDelete);

      if (deleteError) {
        console.error('❌ Failed to delete old projects:', deleteError.message);
      } else {
        console.log('✅ Successfully removed old/private projects from database.');
      }
    }

    console.log(`\n🎉 Sync complete! ${synced}/${publicRepos.length} public projects synced`);
    console.log('\n💡 Check your Supabase dashboard:');
    console.log(`   https://supabase.com/dashboard/project/${supabaseUrl.split('.')[0].replace('https://', '')}/editor`);
    console.log('   Go to: Table Editor → projects\n');
    console.log('🎨 All projects now have proper cover images based on their language!');

    process.exit(0);
  })
  .catch((error: any) => {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  });
