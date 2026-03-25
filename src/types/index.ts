// Profile
export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  socialGithub: string | null;
  socialLinkedin: string | null;
  socialEmail: string | null;
  metaDescription: string | null;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

// Experience
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

// Education
export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

// Skill
export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools';
}

// Project
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
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
