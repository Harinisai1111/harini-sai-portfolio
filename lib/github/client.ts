import { graphql } from '@octokit/graphql';

// In browser (Vite), use import.meta.env
// In Node.js scripts, use process.env
const GITHUB_TOKEN = typeof window !== 'undefined'
  ? (import.meta as any).env.VITE_GITHUB_TOKEN
  : process.env.VITE_GITHUB_TOKEN;
const GITHUB_USERNAME = 'Harinisai1111';

if (!GITHUB_TOKEN) {
  console.warn('GitHub token not found. Please set VITE_GITHUB_TOKEN in .env.local');
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

export interface GitHubRepository {
  id: string;
  databaseId: number;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
  repositoryTopics: {
    nodes: Array<{ topic: { name: string } }>;
  };
  updatedAt: string;
  openGraphImageUrl: string;
  usesCustomOpenGraphImage: boolean;
  isFork: boolean;
  isArchived: boolean;
}

export interface GitHubCommit {
  oid: string;
  message: string;
  committedDate: string;
  author: {
    name: string | null;
    email: string | null;
  };
}

/**
 * Fetch all repositories for the configured GitHub user
 * Excludes forks, sorted by last updated
 */
export async function fetchUserRepositories(): Promise<GitHubRepository[]> {
  try {
    const query = `
      query($username: String!, $first: Int!, $after: String) {
        user(login: $username) {
          repositories(
            first: $first
            after: $after
            orderBy: {field: UPDATED_AT, direction: DESC}
            isFork: false
          ) {
            nodes {
              id
              databaseId
              name
              description
              url
              homepageUrl
              stargazerCount
              primaryLanguage { name }
              repositoryTopics(first: 10) {
                nodes {
                  topic { name }
                }
              }
              updatedAt
              openGraphImageUrl
              usesCustomOpenGraphImage
              isFork
              isArchived
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const result: any = await graphqlWithAuth(query, {
      username: GITHUB_USERNAME,
      first: 100,
      after: null,
    });

    return result.user.repositories.nodes;
  } catch (error: any) {
    console.error('Error fetching repositories:', error);

    if (error.status === 401) {
      throw new Error('Invalid GitHub token. Please check your VITE_GITHUB_TOKEN');
    }
    if (error.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }

    throw error;
  }
}

/**
 * Fetch commits for a specific repository
 * @param repoName - Repository name
 * @param since - Optional ISO date string to fetch commits after this date
 */
export async function fetchRepositoryCommits(
  repoName: string,
  since?: string
): Promise<GitHubCommit[]> {
  try {
    const query = `
      query($owner: String!, $repo: String!, $since: GitTimestamp) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 100, since: $since) {
                  nodes {
                    oid
                    message
                    committedDate
                    author {
                      name
                      email
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result: any = await graphqlWithAuth(query, {
      owner: GITHUB_USERNAME,
      repo: repoName,
      since: since || null,
    });

    if (!result.repository?.defaultBranchRef) {
      console.warn(`No default branch found for ${repoName}`);
      return [];
    }

    return result.repository.defaultBranchRef.target.history.nodes;
  } catch (error: any) {
    console.error(`Error fetching commits for ${repoName}:`, error);

    if (error.status === 404) {
      console.warn(`Repository ${repoName} not found or inaccessible`);
      return [];
    }

    throw error;
  }
}

/**
 * Test GitHub API connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const query = `
      query {
        viewer {
          login
          name
        }
      }
    `;

    const result: any = await graphqlWithAuth(query);
    console.log('✅ GitHub connection successful:', result.viewer);
    return true;
  } catch (error) {
    console.error('❌ GitHub connection failed:', error);
    return false;
  }
}
