import { createClient } from '@supabase/supabase-js';

// In browser (Vite), use import.meta.env
// In Node.js scripts, use process.env
const supabaseUrl = typeof window !== 'undefined'
  ? (import.meta as any).env.VITE_SUPABASE_URL
  : process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = typeof window !== 'undefined'
  ? (import.meta as any).env.VITE_SUPABASE_ANON_KEY
  : process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL:', supabaseUrl);
  console.error('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (auto-generated from Supabase)
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          github_id: number;
          name: string;
          slug: string;
          description: string | null;
          html_url: string;
          homepage: string | null;
          stargazers_count: number;
          language: string | null;
          topics: string[];
          status: 'Active' | 'Paused' | 'Archived';
          category: string | null;
          cover_image: string | null;
          social_preview_url: string | null;
          created_at: string;
          updated_at: string;
          last_synced_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      seasons: {
        Row: {
          id: string;
          project_id: string;
          number: number;
          title: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seasons']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['seasons']['Insert']>;
      };
      episodes: {
        Row: {
          id: string;
          season_id: string;
          project_id: string;
          title: string;
          description: string | null;
          date_range: string | null;
          start_date: string | null;
          end_date: string | null;
          commit_count: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['episodes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['episodes']['Insert']>;
      };
      commits: {
        Row: {
          id: string;
          episode_id: string;
          project_id: string;
          sha: string;
          message: string;
          author: string | null;
          committed_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['commits']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['commits']['Insert']>;
      };
    };
  };
}
