-- Migration: Convert all text columns to JSONB for i18n support
-- This migration is ONE-TIME only — run once, do not run again

-- Profile: convert localized fields
ALTER TABLE profile ALTER COLUMN name TYPE jsonb USING jsonb_build_object('en', COALESCE(name, ''), 'pt', '');
ALTER TABLE profile ALTER COLUMN title TYPE jsonb USING jsonb_build_object('en', COALESCE(title, ''), 'pt', '');
ALTER TABLE profile ALTER COLUMN tagline TYPE jsonb USING jsonb_build_object('en', COALESCE(tagline, ''), 'pt', '');
ALTER TABLE profile ALTER COLUMN bio TYPE jsonb USING jsonb_build_object('en', COALESCE(bio, ''), 'pt', '');
ALTER TABLE profile ALTER COLUMN "metaDescription" TYPE jsonb USING jsonb_build_object('en', COALESCE("metaDescription", ''), 'pt', '');

-- Add language column to profile
ALTER TABLE profile ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';

-- Experience
ALTER TABLE experience ALTER COLUMN company TYPE jsonb USING jsonb_build_object('en', COALESCE(company, ''), 'pt', '');
ALTER TABLE experience ALTER COLUMN role TYPE jsonb USING jsonb_build_object('en', COALESCE(role, ''), 'pt', '');
ALTER TABLE experience ALTER COLUMN description TYPE jsonb USING jsonb_build_object('en', COALESCE(description, ''), 'pt', '');

-- Education
ALTER TABLE education ALTER COLUMN school TYPE jsonb USING jsonb_build_object('en', COALESCE(school, ''), 'pt', '');
ALTER TABLE education ALTER COLUMN degree TYPE jsonb USING jsonb_build_object('en', COALESCE(degree, ''), 'pt', '');
ALTER TABLE education ALTER COLUMN field TYPE jsonb USING jsonb_build_object('en', COALESCE(field, ''), 'pt', '');

-- Skills
ALTER TABLE skills ALTER COLUMN name TYPE jsonb USING jsonb_build_object('en', COALESCE(name, ''), 'pt', '');

-- Projects
ALTER TABLE projects ALTER COLUMN title TYPE jsonb USING jsonb_build_object('en', COALESCE(title, ''), 'pt', '');
ALTER TABLE projects ALTER COLUMN description TYPE jsonb USING jsonb_build_object('en', COALESCE(description, ''), 'pt', '');
