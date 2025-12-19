
# Harini Sai Portfolio

A self-updating portfolio system that ingests GitHub data, normalizes repositories into episodic project narratives, and renders them in a Netflix-style UI.

## 🚀 Key Features

- **Automated GitHub Sync**: Automatically pulls repository metadata and README contents into Supabase.
- **Production Timeline**: Generates a "Production Timeline" for each project by grouping commits into development sprints.
- **AI-Powered Imagery**: Dynamically assigns high-fidelity cover images based on project language and keywords.
- **Netflix-Style UI**: Immersive experience with hero sections, horizontal rows, and detailed project modals.
- **Responsive Design**: Optimized for all devices with smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion, Lucide React
- **Backend & Database**: Supabase
- **Data Ingestion**: GitHub GraphQL API, Octokit

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Project
- GitHub Personal Access Token

### Local Setup

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GITHUB_TOKEN=your_github_token
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔄 Synchronization

The portfolio uses two sync scripts to stay updated with your GitHub activity:

- `npm run sync`: Quick sync for repository metadata and READMEs.
- `npm run sync:full`: Comprehensive sync that also fetches commits and builds the project timelines.

> [!NOTE]
> The GitHub Actions workflow is configured to run `sync:full` every 12 hours to keep the Production Timeline up to date.

## 📄 License

© 2024 HARINI SAI PRODUCTIONS. ALL RIGHTS RESERVED.
