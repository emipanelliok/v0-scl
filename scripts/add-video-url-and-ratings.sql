-- Add video_url column to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS video_url TEXT NOT NULL DEFAULT '';

-- Create judge_ratings table for IP-based ranking
CREATE TABLE IF NOT EXISTS judge_ratings (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  judge_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(submission_id, judge_id)
);

-- Index for fast lookups by judge
CREATE INDEX IF NOT EXISTS idx_judge_ratings_judge_id ON judge_ratings(judge_id);

-- Index for fast lookups by submission
CREATE INDEX IF NOT EXISTS idx_judge_ratings_submission_id ON judge_ratings(submission_id);
