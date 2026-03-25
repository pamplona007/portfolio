// Localized string: { en: "...", pt: "..." }
export type LocalizedString = Record<string, string>;

// Fallback helper
export function getLocalized(value: string | LocalizedString | null | undefined, lang: string): string {
  if (typeof value === 'object' && value !== null) {
    return value[lang] ?? value.en ?? '';
  }
  return typeof value === 'string' ? value : '';
}

// Profile
export interface Profile {
  id: string;
  name: LocalizedString;
  title: LocalizedString;
  tagline: LocalizedString | null;
  bio: LocalizedString | null;
  socialGithub: string | null;
  socialLinkedin: string | null;
  socialEmail: string | null;
  metaDescription: LocalizedString | null;
  language: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

// Experience
export interface Experience {
  id: string;
  company: LocalizedString;
  role: LocalizedString;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: LocalizedString | null;
  sortOrder: number;
  createdAt: string;
}

// Education
export interface Education {
  id: string;
  school: LocalizedString;
  degree: LocalizedString;
  field: LocalizedString;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

// Skill
export interface Skill {
  id: string;
  name: LocalizedString;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
}

// Project
export interface Project {
  id: string;
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  screenshots: string[];
  status: 'active' | 'inactive';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Contact Submission
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Page View
export interface PageView {
  id: string;
  path: string;
  visitedAt: string;
}

// Analytics summary
export interface AnalyticsSummary {
  totalViews: number;
  viewsByDay: { date: string; count: number }[];
  recentSubmissions: ContactSubmission[];
}
