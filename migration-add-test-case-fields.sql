-- Migration: Add goal and expected_outcome columns to test_scripts table
-- Run this in your Supabase SQL editor

-- Add goal column (required field)
ALTER TABLE test_scripts
ADD COLUMN IF NOT EXISTS goal TEXT;

-- Add expected_outcome column (required field)
ALTER TABLE test_scripts
ADD COLUMN IF NOT EXISTS expected_outcome TEXT;

-- Make scenario_id optional (for backward compatibility)
ALTER TABLE test_scripts
ALTER COLUMN scenario_id DROP NOT NULL;

-- Update existing records to have placeholder values (if any exist)
UPDATE test_scripts
SET goal = 'Legacy test case',
    expected_outcome = 'Legacy test case'
WHERE goal IS NULL OR expected_outcome IS NULL;

-- Now make the new columns NOT NULL
ALTER TABLE test_scripts
ALTER COLUMN goal SET NOT NULL;

ALTER TABLE test_scripts
ALTER COLUMN expected_outcome SET NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_scripts'
ORDER BY ordinal_position;
