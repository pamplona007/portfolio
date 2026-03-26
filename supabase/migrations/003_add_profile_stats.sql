-- Migration: Add profile stats columns
-- Adds yearsExperience, projectsDelivered, and yearsAtCompany to profile

ALTER TABLE profile ADD COLUMN IF NOT EXISTS years_experience integer NOT NULL DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS projects_delivered integer NOT NULL DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS years_at_company integer NOT NULL DEFAULT 0;

-- Update existing row with real data
UPDATE profile SET
  years_experience = 8,
  projects_delivered = 50,
  years_at_company = 4
WHERE id = '00000000-0000-0000-0000-000000000001';
