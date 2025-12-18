import type { GitHubCommit } from '../github/client';

export interface Episode {
    title: string;
    description: string;
    dateRange: string;
    startDate: string;
    endDate: string;
    commitCount: number;
    commits: GitHubCommit[];
}

/**
 * Group commits into episodes based on temporal proximity and semantic boundaries
 * 
 * Algorithm:
 * 1. Sort commits chronologically
 * 2. Group commits within 7 days of each other
 * 3. Detect semantic boundaries (version bumps, major refactors)
 * 4. Minimum 3 commits per episode, maximum 20
 */
export function groupCommitsIntoEpisodes(commits: GitHubCommit[]): Episode[] {
    if (commits.length === 0) return [];

    const episodes: Episode[] = [];
    let currentEpisode: GitHubCommit[] = [];

    // Sort commits chronologically (oldest first)
    const sortedCommits = [...commits].sort(
        (a, b) => new Date(a.committedDate).getTime() - new Date(b.committedDate).getTime()
    );

    for (let i = 0; i < sortedCommits.length; i++) {
        const commit = sortedCommits[i];
        const nextCommit = sortedCommits[i + 1];

        currentEpisode.push(commit);

        // Determine if we should split into a new episode
        const shouldSplit =
            !nextCommit || // Last commit
            daysBetween(commit.committedDate, nextCommit.committedDate) > 7 || // 7+ day gap
            currentEpisode.length >= 20 || // Max commits per episode
            isVersionBump(commit.message, nextCommit?.message); // Version change detected

        // Only create episode if we have minimum commits
        if (shouldSplit && currentEpisode.length >= 3) {
            episodes.push(createEpisode(currentEpisode));
            currentEpisode = [];
        }
    }

    // Handle remaining commits (if less than minimum, add to last episode)
    if (currentEpisode.length > 0) {
        if (currentEpisode.length >= 3) {
            episodes.push(createEpisode(currentEpisode));
        } else if (episodes.length > 0) {
            // Merge with last episode
            const lastEpisode = episodes[episodes.length - 1];
            lastEpisode.commits.push(...currentEpisode);
            lastEpisode.commitCount = lastEpisode.commits.length;
            lastEpisode.endDate = currentEpisode[currentEpisode.length - 1].committedDate;
            lastEpisode.dateRange = formatDateRange(lastEpisode.startDate, lastEpisode.endDate);
        }
    }

    return episodes;
}

/**
 * Create an episode from a group of commits
 */
function createEpisode(commits: GitHubCommit[]): Episode {
    const startDate = commits[0].committedDate;
    const endDate = commits[commits.length - 1].committedDate;

    return {
        title: generateEpisodeTitle(commits),
        description: summarizeCommits(commits),
        dateRange: formatDateRange(startDate, endDate),
        startDate,
        endDate,
        commitCount: commits.length,
        commits,
    };
}

/**
 * Generate a descriptive title for an episode based on commit messages
 */
function generateEpisodeTitle(commits: GitHubCommit[]): string {
    const messages = commits.map((c) => c.message.toLowerCase());
    const allText = messages.join(' ');

    // Count keyword occurrences
    const keywords = {
        feature: (allText.match(/\b(feat|feature|add|implement)\w*/g) || []).length,
        refactor: (allText.match(/\b(refactor|optimize|improve)\w*/g) || []).length,
        fix: (allText.match(/\b(fix|bug|patch)\w*/g) || []).length,
        docs: (allText.match(/\b(doc|docs|documentation)\w*/g) || []).length,
        test: (allText.match(/\b(test|testing)\w*/g) || []).length,
        style: (allText.match(/\b(style|ui|ux|design)\w*/g) || []).length,
    };

    // Find dominant category
    const dominant = Object.entries(keywords).reduce((a, b) => (a[1] > b[1] ? a : b));

    const titles: Record<string, string> = {
        feature: 'New Features & Additions',
        refactor: 'Refactoring & Optimization',
        fix: 'Bug Fixes & Improvements',
        docs: 'Documentation Updates',
        test: 'Testing & Quality Assurance',
        style: 'UI/UX Enhancements',
    };

    return titles[dominant[0]] || 'Development Progress';
}

/**
 * Create a summary of commits for episode description
 */
function summarizeCommits(commits: GitHubCommit[]): string {
    const uniqueMessages = [...new Set(commits.map((c) => c.message.split('\n')[0]))];

    if (uniqueMessages.length <= 3) {
        return uniqueMessages.join('. ') + '.';
    }

    // Extract key themes
    const themes: string[] = [];
    const allText = uniqueMessages.join(' ').toLowerCase();

    if (allText.includes('api') || allText.includes('endpoint')) themes.push('API development');
    if (allText.includes('ui') || allText.includes('component')) themes.push('UI components');
    if (allText.includes('database') || allText.includes('schema')) themes.push('database work');
    if (allText.includes('test')) themes.push('testing');
    if (allText.includes('deploy') || allText.includes('build')) themes.push('deployment');

    if (themes.length > 0) {
        return `Focused on ${themes.join(', ')} with ${commits.length} commits.`;
    }

    return `${commits.length} commits advancing the project with various improvements and features.`;
}

/**
 * Format date range for display
 */
function formatDateRange(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const year = startDate.getFullYear();

    if (startMonth === endMonth) {
        return `${startMonth} ${year}`;
    }

    return `${startMonth} - ${endMonth} ${year}`;
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Detect version bump between commit messages
 */
function isVersionBump(msg1: string, msg2?: string): boolean {
    if (!msg2) return false;

    const versionRegex = /v?\d+\.\d+(\.\d+)?/;
    const v1 = msg1.match(versionRegex);
    const v2 = msg2.match(versionRegex);

    if (v1 && v2 && v1[0] !== v2[0]) {
        return true;
    }

    // Check for release keywords
    const releaseKeywords = ['release', 'version', 'bump', 'tag'];
    return releaseKeywords.some((kw) => msg2.toLowerCase().includes(kw));
}
