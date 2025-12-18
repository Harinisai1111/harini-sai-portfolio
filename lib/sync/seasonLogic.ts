import type { Episode } from './episodeLogic';

export interface Season {
    number: number;
    title: string;
    episodes: Episode[];
}

/**
 * Group episodes into seasons based on temporal gaps and project milestones
 * 
 * Algorithm:
 * 1. Detect 30+ day gaps between episodes
 * 2. Identify major version changes
 * 3. Generate meaningful season titles
 */
export function groupEpisodesIntoSeasons(episodes: Episode[]): Season[] {
    if (episodes.length === 0) return [];

    const seasons: Season[] = [];
    let currentSeason: Episode[] = [];
    let seasonNumber = 1;

    for (let i = 0; i < episodes.length; i++) {
        const episode = episodes[i];
        const nextEpisode = episodes[i + 1];

        currentSeason.push(episode);

        // Determine if we should split into a new season
        const shouldSplit =
            !nextEpisode || // Last episode
            daysBetween(episode.endDate, nextEpisode.startDate) > 30 || // 30+ day gap
            hasVersionJump(episode, nextEpisode); // Major version change

        if (shouldSplit) {
            seasons.push({
                number: seasonNumber,
                title: generateSeasonTitle(currentSeason, seasonNumber),
                episodes: currentSeason,
            });
            seasonNumber++;
            currentSeason = [];
        }
    }

    return seasons;
}

/**
 * Generate a meaningful season title
 */
function generateSeasonTitle(episodes: Episode[], seasonNum: number): string {
    const startYear = new Date(episodes[0].startDate).getFullYear();
    const endYear = new Date(episodes[episodes.length - 1].endDate).getFullYear();

    // Season 1 is always "Foundation"
    if (seasonNum === 1) {
        return 'The Foundation';
    }

    // Check for version indicators in episode commits
    const allCommits = episodes.flatMap((e) => e.commits);
    const hasV2 = allCommits.some((c) => /v2|2\.0|version 2/i.test(c.message));
    const hasV3 = allCommits.some((c) => /v3|3\.0|version 3/i.test(c.message));

    if (hasV3) return 'Evolution Era';
    if (hasV2) return 'Growth Phase';

    // Check for major refactors
    const hasRefactor = allCommits.some((c) => /refactor|rewrite|migration/i.test(c.message));
    if (hasRefactor) return 'Refinement Stage';

    // Default titles based on season number
    const defaultTitles = [
        'The Foundation',
        'Growth Phase',
        'Maturity Stage',
        'Evolution Era',
        'Advanced Development',
    ];

    if (seasonNum <= defaultTitles.length) {
        return defaultTitles[seasonNum - 1];
    }

    // For later seasons, use year
    return `Season ${seasonNum} (${startYear})`;
}

/**
 * Detect major version jump between episodes
 */
function hasVersionJump(episode1: Episode, episode2?: Episode): boolean {
    if (!episode2) return false;

    const v1 = extractVersion(episode1);
    const v2 = extractVersion(episode2);

    if (!v1 || !v2) return false;

    // Check if major version increased
    return v2.major > v1.major;
}

/**
 * Extract version number from episode commits
 */
function extractVersion(episode: Episode): { major: number; minor: number } | null {
    const versionRegex = /v?(\d+)\.(\d+)(?:\.\d+)?/;

    for (const commit of episode.commits) {
        const match = commit.message.match(versionRegex);
        if (match) {
            return {
                major: parseInt(match[1], 10),
                minor: parseInt(match[2], 10),
            };
        }
    }

    return null;
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
