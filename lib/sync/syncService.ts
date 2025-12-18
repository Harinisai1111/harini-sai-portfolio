import { supabase } from '../supabase/client';
import { fetchUserRepositories, fetchRepositoryCommits } from '../github/client';
import { groupCommitsIntoEpisodes } from './episodeLogic';
import { groupEpisodesIntoSeasons } from './seasonLogic';
import type { GitHubRepository } from '../github/client';

/**
 * Main sync service to fetch GitHub data and populate Supabase
 */
export async function syncGitHubData(): Promise<{
    success: boolean;
    projectsSynced: number;
    error?: string;
}> {
    try {
        console.log('🔄 Starting GitHub sync...');

        // 1. Fetch all repositories from GitHub
        const repos = await fetchUserRepositories();
        console.log(`📦 Found ${repos.length} repositories`);

        let projectsSynced = 0;

        // 2. Process each repository
        for (const repo of repos) {
            try {
                await syncRepository(repo);
                projectsSynced++;
                console.log(`✅ Synced: ${repo.name}`);
            } catch (error) {
                console.error(`❌ Failed to sync ${repo.name}:`, error);
                // Continue with other repos even if one fails
            }
        }

        console.log(`🎉 Sync complete! ${projectsSynced}/${repos.length} projects synced`);

        return {
            success: true,
            projectsSynced,
        };
    } catch (error: any) {
        console.error('❌ Sync failed:', error);
        return {
            success: false,
            projectsSynced: 0,
            error: error.message,
        };
    }
}

/**
 * Sync a single repository to Supabase
 */
async function syncRepository(repo: GitHubRepository): Promise<void> {
    // 1. Upsert project
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .upsert(
            {
                github_id: repo.databaseId,
                name: repo.name,
                slug: createSlug(repo.name),
                description: repo.description,
                html_url: repo.url,
                homepage: repo.homepageUrl,
                stargazers_count: repo.stargazerCount,
                language: repo.primaryLanguage?.name || null,
                topics: repo.repositoryTopics.nodes.map((t) => t.topic.name),
                social_preview_url: repo.openGraphImageUrl,
                status: determineStatus(repo),
                category: categorizeRepo(repo),
                updated_at: repo.updatedAt,
                last_synced_at: new Date().toISOString(),
            },
            { onConflict: 'github_id' }
        )
        .select()
        .single();

    if (projectError) {
        throw new Error(`Failed to upsert project: ${projectError.message}`);
    }

    // 2. Fetch commits from GitHub
    const commits = await fetchRepositoryCommits(repo.name);

    if (commits.length === 0) {
        console.log(`⚠️  No commits found for ${repo.name}`);
        return;
    }

    // 3. Group commits into episodes
    const episodes = groupCommitsIntoEpisodes(commits);

    // 4. Group episodes into seasons
    const seasons = groupEpisodesIntoSeasons(episodes);

    // 5. Delete existing seasons/episodes/commits for this project
    await supabase.from('seasons').delete().eq('project_id', project.id);

    // 6. Insert new seasons, episodes, and commits
    for (const season of seasons) {
        // Insert season
        const { data: seasonData, error: seasonError } = await supabase
            .from('seasons')
            .insert({
                project_id: project.id,
                number: season.number,
                title: season.title,
            })
            .select()
            .single();

        if (seasonError) {
            console.error(`Failed to insert season: ${seasonError.message}`);
            continue;
        }

        // Insert episodes for this season
        for (const episode of season.episodes) {
            const { data: episodeData, error: episodeError } = await supabase
                .from('episodes')
                .insert({
                    season_id: seasonData.id,
                    project_id: project.id,
                    title: episode.title,
                    description: episode.description,
                    date_range: episode.dateRange,
                    start_date: episode.startDate,
                    end_date: episode.endDate,
                    commit_count: episode.commitCount,
                })
                .select()
                .single();

            if (episodeError) {
                console.error(`Failed to insert episode: ${episodeError.message}`);
                continue;
            }

            // Insert commits for this episode
            const commitInserts = episode.commits.map((commit) => ({
                episode_id: episodeData.id,
                project_id: project.id,
                sha: commit.oid,
                message: commit.message,
                author: commit.author.name || commit.author.email || 'Unknown',
                committed_at: commit.committedDate,
            }));

            const { error: commitsError } = await supabase
                .from('commits')
                .insert(commitInserts);

            if (commitsError) {
                console.error(`Failed to insert commits: ${commitsError.message}`);
            }
        }
    }
}

/**
 * Determine project status based on GitHub metadata
 */
function determineStatus(repo: GitHubRepository): 'Active' | 'Paused' | 'Archived' {
    if (repo.isArchived) return 'Archived';

    const lastUpdate = new Date(repo.updatedAt);
    const now = new Date();
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate < 30) return 'Active';
    if (daysSinceUpdate < 180) return 'Paused';
    return 'Archived';
}

/**
 * Categorize repository based on language and topics
 */
function categorizeRepo(repo: GitHubRepository): string {
    const topics = repo.repositoryTopics.nodes.map((t) => t.topic.name.toLowerCase());
    const language = repo.primaryLanguage?.name.toLowerCase() || '';

    // Frontend
    if (
        topics.some((t) => ['react', 'vue', 'angular', 'frontend', 'ui'].includes(t)) ||
        ['typescript', 'javascript'].includes(language)
    ) {
        return 'Frontend';
    }

    // Backend
    if (
        topics.some((t) => ['backend', 'api', 'server', 'node'].includes(t)) ||
        ['go', 'python', 'java', 'ruby', 'php'].includes(language)
    ) {
        return 'Backend';
    }

    // Systems
    if (
        topics.some((t) => ['systems', 'low-level', 'performance'].includes(t)) ||
        ['rust', 'c++', 'c'].includes(language)
    ) {
        return 'Systems';
    }

    // Mobile
    if (
        topics.some((t) => ['mobile', 'ios', 'android'].includes(t)) ||
        ['swift', 'kotlin', 'dart'].includes(language)
    ) {
        return 'Mobile';
    }

    // Data/ML
    if (topics.some((t) => ['ml', 'ai', 'data', 'machine-learning'].includes(t))) {
        return 'Data Science';
    }

    return 'Other';
}

/**
 * Create URL-friendly slug from repository name
 */
function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
