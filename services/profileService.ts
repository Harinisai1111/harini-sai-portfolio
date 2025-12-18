import { graphql } from '@octokit/graphql';

const GITHUB_TOKEN = typeof window !== 'undefined'
    ? (import.meta as any).env.VITE_GITHUB_TOKEN
    : process.env.VITE_GITHUB_TOKEN;
const GITHUB_USERNAME = 'Harinisai1111';

const graphqlWithAuth = graphql.defaults({
    headers: { authorization: `token ${GITHUB_TOKEN}` },
});

/**
 * Fetch GitHub profile README content
 * This fetches the README.md from the special username/username repository
 */
export async function fetchProfileReadme(): Promise<string | null> {
    try {
        const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
        }
      }
    `;

        const result: any = await graphqlWithAuth(query, {
            owner: GITHUB_USERNAME,
            repo: GITHUB_USERNAME, // Special repo: username/username
        });

        return result.repository?.object?.text || null;
    } catch (error) {
        console.error('Error fetching profile README:', error);
        return null;
    }
}

/**
 * Fetch user bio and stats
 */
export async function fetchUserProfile(): Promise<{
    bio: string | null;
    name: string | null;
    avatarUrl: string;
    followers: number;
    following: number;
    repositories: number;
} | null> {
    try {
        const query = `
      query($username: String!) {
        user(login: $username) {
          name
          bio
          avatarUrl
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories(privacy: PUBLIC) {
            totalCount
          }
        }
      }
    `;

        const result: any = await graphqlWithAuth(query, {
            username: GITHUB_USERNAME,
        });

        const user = result.user;
        return {
            bio: user.bio,
            name: user.name,
            avatarUrl: user.avatarUrl,
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            repositories: user.repositories.totalCount,
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}
