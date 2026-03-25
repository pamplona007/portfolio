# Portfolio CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A full-stack portfolio CMS with public site and admin dashboard, backed by Supabase + Prisma.

**Architecture:** Monorepo React app (Vite + TypeScript), CSS Modules for styling, Supabase for database/auth/storage, Hono for API routes. Public pages at `/`, admin at `/dashboard/*`. Admin routes protected by Supabase session.

**Tech Stack:** React 18 + Vite + TypeScript, CSS Modules, React Router v6, Zod + React Hook Form, Radix UI (admin only), Lucide React, Prisma, Supabase, Hono.js

---

## Phase 1: Project Foundation

### 1.1: Scaffold Vite project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `.env.example`
- Create: `.gitignore`

**Tasks:**
- [ ] **Create package.json**

```json
{
  "name": "portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "test": "vitest",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

- [ ] **Install dependencies**

```bash
npm install react react-dom react-router-dom react-hook-form @hookform/resolvers zod lucide-react
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom eslint vitest jsdom @testing-library/react @testing-library/user-event
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-slot
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install prisma
npm install @prisma/client hono
```

- [ ] **Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Create tsconfig.json** (standard Vite + React + path aliases)

- [ ] **Create index.html** with `<div id="root"></div>` and Google Fonts link for Plus Jakarta Sans

- [ ] **Create .env.example**

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 1.2: Set up folder structure and CSS foundation

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/global.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/vite-env.d.ts`

**Tasks:**
- [ ] **Create `src/styles/variables.css`** — CSS custom properties for all design tokens from SPEC.md

```css
:root {
  /* Colors - Light */
  --color-bg: #FAFAF8;
  --color-surface: #FFFFFF;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-accent: #5B8A72;
  --color-accent-gradient: linear-gradient(135deg, #5B8A72 0%, #7BA39A 100%);
  --color-border: #E8E8E6;

  /* Spacing (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-30: 120px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Max widths */
  --max-width-text: 720px;
  --max-width-grid: 1100px;

  /* Fonts */
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 400ms ease-out;
}
```

- [ ] **Create `src/styles/global.css`** — reset, body styles, font import

- [ ] **Create `src/main.tsx`** — React DOM render with router

- [ ] **Create `src/App.tsx`** — router setup with public routes and dashboard routes

- [ ] **Create `src/vite-env.d.ts`** — Vite client types

---

### 1.3: Set up Prisma schema

**Files:**
- Create: `prisma/schema.prisma`

**Tasks:**
- [ ] **Create `prisma/schema.prisma`** with models from SPEC.md: Profile, Experience, Education, Skill, Project, ContactSubmission, PageView

- [ ] **Create `prisma/.env`** (gitignored) with `DATABASE_URL=postgresql://...`

- [ ] **Push schema to Supabase**

```bash
npx prisma db push
```

---

## Phase 2: Supabase Service Layer

### 2.1: Supabase client and types

**Files:**
- Create: `src/services/supabase.ts`
- Create: `src/services/analytics.ts`
- Create: `src/types/index.ts`

**Tasks:**
- [ ] **Create `src/services/supabase.ts`** — Supabase client singleton for browser

- [ ] **Create `src/types/index.ts`** — TypeScript types matching Prisma models (generated from schema ideally, but write manually if prisma generate isn't wired yet)

- [ ] **Create `src/services/analytics.ts`** — page view tracking function (debounced INSERT to page_views)

---

## Phase 3: Public Site — Layout & Components

### 3.1: Public Layout

**Files:**
- Create: `src/components/public/Layout/index.tsx`
- Create: `src/components/public/Layout/styles.module.css`
- Create: `src/components/public/Header/index.tsx`
- Create: `src/components/public/Header/styles.module.css`
- Create: `src/components/public/Footer/index.tsx`
- Create: `src/components/public/Footer/styles.module.css`

**Tasks:**
- [ ] **Create Layout** — max-width wrapper, Header + children + Footer
- [ ] **Create Header** — site name (links home), nav links (About, Projects, Contact), mobile hamburger menu with slide-down
- [ ] **Create Footer** — minimal, copyright + social links

---

### 3.2: Public Shared Components

**Files (each component = index.tsx + styles.module.css):**
- Create: `src/components/public/Button/`
- Create: `src/components/public/Badge/`
- Create: `src/components/public/Card/`
- Create: `src/components/public/SocialLinks/`
- Create: `src/components/public/SkillChip/`

**Tasks:**
- [ ] **Button** — variants: primary (gradient bg), ghost (border only), sizes: sm/md/lg, loading state with spinner
- [ ] **Badge** — tech tag pill style
- [ ] **Card** — surface background, rounded-lg, shadow-sm, hover: shadow-md + translateY(-2px)
- [ ] **SocialLinks** — row of icon-only links (GitHub, LinkedIn, Email)
- [ ] **SkillChip** — icon + label, category color coding

---

### 3.3: Public Pages

**Files (each page = index.tsx + styles.module.css):**
- Create: `src/pages/public/Home/`
- Create: `src/pages/public/About/`
- Create: `src/pages/public/Projects/`
- Create: `src/pages/public/Contact/`

**Tasks:**
- [ ] **Home** — hero section, name/title/tagline from profile, gradient CTA buttons, soft gradient bg
- [ ] **About** — bio text, experience timeline, skills grid, education section
- [ ] **Projects** — project card grid with filter by tech stack
- [ ] **Contact** — contact form (name, email, message), Zod validation, success/error states

---

## Phase 4: Admin Dashboard

### 4.1: Admin Layout & Auth

**Files:**
- Create: `src/components/admin/DashboardLayout/index.tsx`
- Create: `src/components/admin/DashboardLayout/styles.module.css`
- Create: `src/pages/admin/Login/index.tsx`
- Create: `src/pages/admin/Login/styles.module.css`
- Create: `src/components/admin/ProtectedRoute.tsx`

**Tasks:**
- [ ] **ProtectedRoute** — checks Supabase session, redirects to `/dashboard/login` if none
- [ ] **Login page** — email/password form, Supabase Auth, error display
- [ ] **DashboardLayout** — sidebar nav (Dashboard, About, Projects, Contact, Settings, Logout), dark theme

---

### 4.2: Admin Shared Components

**Files:**
- Create: `src/components/admin/StatsCard/`
- Create: `src/components/admin/DataTable/`
- Create: `src/components/admin/CrudForm/`
- Create: `src/components/admin/Modal/`
- Create: `src/components/admin/Toast/`
- Create: `src/components/admin/ImageUpload/`

**Tasks:**
- [ ] **StatsCard** — number, label, optional trend indicator
- [ ] **DataTable** — sortable columns, empty state, loading skeleton state
- [ ] **CrudForm** — generic form wrapper with Zod + React Hook Form
- [ ] **Modal** — Radix Dialog, backdrop blur
- [ ] **Toast** — Radix Toast, success/error variants
- [ ] **ImageUpload** — file input + preview + upload to Supabase Storage

---

### 4.3: Admin Pages

**Files:**
- Create: `src/pages/admin/Dashboard/index.tsx`
- Create: `src/pages/admin/Dashboard/styles.module.css`
- Create: `src/pages/admin/AboutEditor/index.tsx`
- Create: `src/pages/admin/ProjectsEditor/index.tsx`
- Create: `src/pages/admin/ContactSubmissions/index.tsx`
- Create: `src/pages/admin/Settings/index.tsx`

**Tasks:**
- [ ] **Dashboard** — stats cards (views, submissions, projects), page views bar chart (last 7 days), recent submissions table
- [ ] **AboutEditor** — bio rich text (or textarea), inline CRUD for Experience and Education entries, skills tag editor
- [ ] **ProjectsEditor** — table view, create/edit modal with ImageUpload, delete confirmation
- [ ] **ContactSubmissions** — table with mark-as-read, export CSV button
- [ ] **Settings** — profile form (name, title, tagline, social links, meta)

---

## Phase 5: Stitch UI Generation

**Note:** Use Stitch (`mcp__stitch__generate_screen_from_text`) to generate initial visual designs for the public pages (Home, About, Projects, Contact) before building them. This is the creative draft phase — iterate on Stitch output to match design spec.

**Tasks:**
- [ ] Use Stitch to generate Home page design
- [ ] Use Stitch to generate About page design
- [ ] Use Stitch to generate Projects page design
- [ ] Use Stitch to generate Contact page design
- [ ] Refine generated designs to match SPEC.md design tokens and component inventory

---

## Phase 6: Hooks, Services & Final Wiring

**Files:**
- Create: `src/hooks/useProfile.ts`
- Create: `src/hooks/useProjects.ts`
- Create: `src/hooks/useContact.ts`
- Create: `src/hooks/useAnalytics.ts`

**Tasks:**
- [ ] **useProfile** — fetch profile from Supabase (public read)
- [ ] **useProjects** — fetch all projects, filter by tech
- [ ] **useContact** — submit contact form
- [ ] **useAnalytics** — fetch page view stats (dashboard only)

---

## Phase 7: Seed Data & Polish

**Tasks:**
- [ ] Create seed script to populate Profile, Experience, Education, Skills from Lucas's PDF content
- [ ] Add entrance animations (CSS keyframes for fade + translateY)
- [ ] Add hover animations on cards and buttons
- [ ] Test responsive layout at 320px, 768px, 1280px
- [ ] Error boundary with fallback UI
- [ ] Page view tracking on each public page mount

---

## Verification

After each phase:
- Run `npm run build` to verify no type/compile errors
- Run `npm run test` to verify tests pass
- Test in browser at `localhost:5173`
