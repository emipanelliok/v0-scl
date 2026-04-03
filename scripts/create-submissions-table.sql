CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  live_url TEXT NOT NULL,
  v0_project_url TEXT NOT NULL,
  github_repo_url TEXT NOT NULL,
  global_categories TEXT[] NOT NULL DEFAULT '{}',
  local_categories TEXT[] NOT NULL DEFAULT '{}',
  your_name TEXT NOT NULL,
  v0_username TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  social_proof_link TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
