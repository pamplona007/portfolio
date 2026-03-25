# Portfolio CMS — Specification

## 1. Concept & Vision

A personal portfolio that functions as a lightweight CMS — designed for Lucas Pamplona, Senior Full-Stack Developer. The public site presents a calm, professional presence with generous whitespace and soft gradients. The admin dashboard provides full content management with page view analytics, all in a monorepo that stays simple to maintain.

**Personality:** Minimal, spacious, warm — not corporate-cold. Feels like a well-designed editorial piece, not a SaaS template.

---

## 2. Design Language

### Aesthetic
Minimalist and airy. Light theme to start, dark theme to follow.

### Colors
- Background: `#FAFAF8` (warm off-white)
- Surface: `#FFFFFF`
- Text primary: `#1A1A1A`
- Text secondary: `#6B6B6B`
- Accent: `#5B8A72` (muted sage/teal — warm, distinctive)
- Accent gradient: `linear-gradient(135deg, #5B8A72 0%, #7BA39A 100%)`
- Border: `#E8E8E6`
- Admin dark surface: `#1E1E1E`

### Typography
- Font: Plus Jakarta Sans (Google Fonts)
- Headings: 700 weight, tight letter-spacing
- Body: 400/500 weight, relaxed line-height (1.6–1.7)
- Code: JetBrains Mono

### Spacing & Shape
- Base unit: 4px
- Section padding: 80–120px vertical on desktop, 48px on mobile
- Card radius: 12px
- Button radius: 8px
- Max content width: 720px (text), 1100px (grids)

### Motion
- Entrance: `opacity 0→1 + translateY(12px→0)`, 400ms ease-out, staggered 80ms
- Hover: subtle scale (1.02) + shadow lift, 200ms
- Page transitions: fade 200ms
- Gradient buttons: subtle hover shift in gradient angle

### Visual Assets
- Icons: Lucide React (consistent stroke, matches minimal aesthetic)
- No hardcoded images in code — content-driven from CMS

---

## 3. Layout & Structure

### Public Site Pages

**`/` — Home**
- Full-viewport hero: name, title, one-line tagline
- Soft gradient background (very subtle, ~3% opacity)
- CTA buttons: "View Projects" (primary gradient), "Contact" (ghost)
- Social links: GitHub, LinkedIn, Email

**`/about` — About**
- Two-column on desktop: bio text left, skills/quick-facts right
- Experience timeline (vertical, dot-connected)
- Education section
- Skills grid (icon + label chips)

**`/projects` — Projects**
- Masonry or 2-col grid of project cards
- Each card: screenshot/preview, title, tech stack tags, short description, links (live, repo)
- Filter by technology (client-side)

**`/contact` — Contact**
- Minimal form: name, email, message
- Submits to Supabase, shows success state
- Social links as fallback

### Admin Dashboard Pages

**`/dashboard` — Overview**
- Stats cards: total page views, contact submissions, project count
- Page views chart (last 7 days, bar chart)
- Recent contact submissions table
- Quick links to edit sections

**`/dashboard/about` — Edit About**
- Rich text editor for bio
- Inline add/edit/delete for experience entries
- Inline add/edit/delete for education entries
- Skills tag editor

**`/dashboard/projects` — Manage Projects**
- CRUD table: title, tech stack, status (live/inactive), actions
- Create/edit modal or slide-over panel: title, slug, description, tech stack, live URL, repo URL, screenshots (upload to Supabase Storage)

**`/dashboard/contact` — View Submissions**
- Table: name, email, message, timestamp
- Mark as read/unread
- Export to CSV

**`/dashboard/settings` — Site Settings**
- Public site config: name, title, tagline, social links, meta description
- Theme toggle (light/dark) — stored, activates later

---

## 4. Features & Interactions

### Public Site
- **Page view tracking** — each page load fires a Supabase insertion to a `page_views` table (async, non-blocking)
- **Contact form** — validates client-side (Zod), submits to Supabase, shows inline success/error
- **Project filter** — client-side filter by tech tag, instant, no reload
- **Smooth scroll navigation** — anchor links scroll smoothly
- **Responsive** — mobile-first breakpoints at 640px, 1024px

### Admin Dashboard
- **Auth gate** — all `/dashboard/*` routes redirect to `/dashboard/login` if no Supabase session
- **Dashboard login** — email/password via Supabase Auth (magic link optional)
- **CRUD everywhere** — forms use Zod validation, optimistic UI updates where possible
- **Image upload** — project screenshots upload to Supabase Storage, store URL in DB
- **Real-time** — contact submissions and page views update dashboard without refresh (Supabase realtime)

### Error States
- Public site: minimal error boundary with "Something went wrong" + retry
- Contact form: inline field errors (Zod), server error toast
- Admin: form-level error summaries, field-level inline errors

### Loading States
- Public: skeleton loaders matching layout (not spinners)
- Admin: Radix UI skeleton primitives

---

## 5. Component Inventory

### Public Components
| Component | States |
|---|---|
| `Button` | primary (gradient), ghost, disabled, loading |
| `Card` | default, hover (lift + shadow) |
| `Badge` | tech tag style |
| `Timeline` | dot-connected vertical line, entry with date/title/description |
| `ContactForm` | idle, submitting, success, error |
| `ProjectCard` | default, hover |
| `SkillChip` | icon + label |
| `SocialLinks` | icon-only row |

### Admin Components
| Component | States |
|---|---|
| `DashboardLayout` | sidebar + header + content |
| `StatsCard` | number + label + trend indicator |
| `DataTable` | default, empty, loading |
| `CrudForm` | create, edit, validation errors |
| `Modal` | open/closed with backdrop |
| `Toast` | success, error, info |
| `ImageUpload` | empty, preview, uploading, error |

---

## 6. Technical Approach

### Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** CSS Modules (per-component `.module.css`)
- **UI Components:** Radix UI (admin only)
- **Forms:** Zod + React Hook Form
- **Routing:** React Router v6
- **Backend:** Hono.js (API routes for server-side operations if needed)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** Supabase Auth (email/password for admin)
- **Storage:** Supabase Storage (project screenshots)
- **Analytics:** Custom page view tracking in Supabase

### Database Schema (Supabase/Postgres via Prisma)

```prisma
model Profile {
  id        String   @id @default(uuid())
  name      String
  title     String
  tagline   String?
  bio       String?
  socialGithub   String?
  socialLinkedin String?
  socialEmail   String?
  metaDescription String?
  theme     String   @default("light") // "light" | "dark"
  updatedAt DateTime @updatedAt
}

model Experience {
  id          String   @id @default(uuid())
  company     String
  role        String
  startDate   DateTime
  endDate     DateTime?
  current     Boolean  @default(false)
  description String?
  order       Int      @default(0)
}

model Education {
  id        String   @id @default(uuid())
  school    String
  degree    String
  field     String
  startDate DateTime
  endDate   DateTime?
}

model Skill {
  id       String @id @default(uuid())
  name     String
  category String // "frontend" | "backend" | "devops" | "tools"
}

model Project {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  description String
  techStack   String[] // array of technology names
  liveUrl     String?
  repoUrl     String?
  screenshots String[] // Supabase Storage URLs
  status      String   @default("active") // "active" | "inactive"
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ContactSubmission {
  id        String   @id @default(uuid())
  name      String
  email     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model PageView {
  id        String   @id @default(uuid())
  path      String
  visitedAt DateTime @default(now())
}
```

### API Design (Supabase RPC + REST via Hono)

| Method | Path | Description |
|---|---|---|
| GET | `/api/analytics/views` | Page views aggregation (last 7 days) |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/profile` | Get public profile |

### Folder Structure

```
portfolio/
  SPEC.md
  package.json
  vite.config.ts
  tsconfig.json
  prisma/
    schema.prisma
  src/
    main.tsx
    App.tsx
    pages/
      public/
        Home/
        About/
        Projects/
        Contact/
      admin/
        Dashboard/
        Login/
    components/
      public/
        Button/
        Card/
        Badge/
        Timeline/
        ProjectCard/
        SkillChip/
        SocialLinks/
      admin/
        DashboardLayout/
        StatsCard/
        DataTable/
        CrudForm/
        Modal/
        Toast/
        ImageUpload/
    hooks/
    services/
      supabase.ts
      analytics.ts
    types/
    styles/
      global.css
      variables.css
  public/
```

### Key Implementation Notes
- Public site uses Vite's SPA routing (React Router), all pages pre-render-friendly
- Admin routes protected by `ProtectedRoute` component checking Supabase session
- Page view tracking: lightweight `INSERT` on each page mount, debounced
- Image upload: direct to Supabase Storage via signed URL (no server middleman)
- Supabase realtime for contact submissions and dashboard stats auto-update
