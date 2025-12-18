// Simple GitHub test without complex imports
import { config } from 'dotenv';
config({ path: '.env.local' });

import { graphql } from '@octokit/graphql';

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;

console.log('🔍 Testing GitHub connection...\n');
console.log(`Token found: ${GITHUB_TOKEN ? 'Yes' : 'No'}`);
console.log(`Token starts with ghp_: ${GITHUB_TOKEN?.startsWith('ghp_') ? 'Yes' : 'No'}\n`);

if (!GITHUB_TOKEN) {
    console.error('❌ No GitHub token found in .env.local');
    process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `token ${GITHUB_TOKEN}`,
    },
});

const query = `
  query {
    viewer {
      login
      name
    }
  }
`;

graphqlWithAuth(query)
    .then((result: any) => {
        console.log('✅ GitHub connection successful!');
        console.log(`   Logged in as: ${result.viewer.login}`);
        console.log(`   Name: ${result.viewer.name || 'Not set'}\n`);
        console.log('🎉 You can now run: npm run sync');
        process.exit(0);
    })
    .catch((error: any) => {
        console.error('❌ GitHub connection failed!');
        console.error(`   Error: ${error.message}\n`);

        if (error.status === 401) {
            console.log('🔍 The token is invalid or expired.');
            console.log('   Please create a new token at: https://github.com/settings/tokens/new');
        } else if (error.status === 403) {
            console.log('🔍 Rate limit exceeded or insufficient permissions.');
            console.log('   Make sure your token has "repo" and "read:user" scopes.');
        }

        process.exit(1);
    });
