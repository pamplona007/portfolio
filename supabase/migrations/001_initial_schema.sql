-- Portfolio CMS Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profile (single row)
create table if not exists profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  title text not null,
  tagline text,
  bio text,
  socialGithub text,
  socialLinkedin text,
  socialEmail text,
  metaDescription text,
  theme text not null default 'dark',
  createdAt timestamptz default now(),
  updatedAt timestamptz default now()
);

-- Experience
create table if not exists experience (
  id uuid primary key default uuid_generate_v4(),
  company text not null,
  role text not null,
  startDate text not null,
  endDate text,
  "current" boolean not null default false,
  description text,
  sortOrder integer not null default 0,
  createdAt timestamptz default now()
);

-- Education
create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  school text not null,
  degree text not null,
  field text not null,
  startDate text not null,
  endDate text,
  createdAt timestamptz default now()
);

-- Skills
create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('frontend', 'backend', 'devops', 'tools'))
);

-- Projects
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  techStack text[] not null default '{}',
  liveUrl text,
  repoUrl text,
  screenshots text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'inactive')),
  sortOrder integer not null default 0,
  createdAt timestamptz default now(),
  updatedAt timestamptz default now()
);

-- Contact Submissions
create table if not exists contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  createdAt timestamptz default now()
);

-- Page Views (analytics)
create table if not exists page_views (
  id uuid primary key default uuid_generate_v4(),
  path text not null,
  visitedAt timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_experience_order on experience("sortOrder");
create index if not exists idx_projects_order on projects("sortOrder");
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_contact_submissions_read on contact_submissions(read);
create index if not exists idx_contact_submissions_created on contact_submissions(createdAt desc);
create index if not exists idx_page_views_path on page_views(path);
create index if not exists idx_page_views_visited on page_views(visitedAt);

-- Insert default profile row
insert into profile (name, title, tagline, bio, theme)
values ('Your Name', 'Developer', 'Building digital experiences', 'Tell your story here...', 'dark')
on conflict do nothing;

-- Row Level Security (RLS) - enable for security
alter table profile enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table contact_submissions enable row level security;
alter table page_views enable row level security;

-- Public read access for profile, experience, education, skills, projects (for public site)
create policy "Public read profile" on profile for select using (true);
create policy "Public read experience" on experience for select using (true);
create policy "Public read education" on education for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read projects" on projects for select using (true);

-- Public insert for contact submissions
create policy "Public insert contact" on contact_submissions for insert with check (true);

-- Public insert for page views
create policy "Public insert page_views" on page_views for insert with check (true);

-- Authenticated users can do all operations on all tables (admin dashboard)
create policy "Authenticated full access" on profile for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on experience for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on education for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on skills for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on projects for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on contact_submissions for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on page_views for all using (auth.role() = 'authenticated');
