-- Migration: Add README and created_at columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS readme TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;

-- Update the project type in your codebase if necessary
-- Note: You can run this in the Supabase SQL Editor to enable project documentation storage.
