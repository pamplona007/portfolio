# Portfolio i18n — Implementation Design

> **Goal:** Add i18next for translations and enable bilingual content (EN/PT) for all text fields in the portfolio CMS.

---

## 1. Tech Stack

- **i18next** + **react-i18next** for frontend translations
- **i18next-browser-languagedetector** for auto-detection + manual toggle
- JSONB columns in Supabase for translatable text fields
- Tabbed admin editor UI (existing `CrudForm` extended with language tabs)

---

## 2. Language Detection

- On first visit: detect browser `navigator.language` → if starts with `pt`, default to PT, else EN
- Language toggle in public site header (flag icon or text switcher)
- Choice persisted to `localStorage` as `i18nextLng`
- `i18next-browser-languagedetector` handles this automatically

---

## 3. Database Schema Changes

All text fields use JSONB: `{ en: "...", pt: "..." }`. Non-translatable fields stay as-is.

### Profile
| Field | Type | Notes |
|---|---|---|
| name | jsonb | translatable |
| title | jsonb | translatable |
| tagline | jsonb | translatable |
| bio | jsonb | translatable |
| socialGithub | text | NOT translatable |
| socialLinkedin | text | NOT translatable |
| socialEmail | text | NOT translatable |
| metaDescription | jsonb | translatable |
| language | text | NOT translatable — admin default site language (en/pt) |
| theme | text | NOT translatable |

### Experience
| Field | Type | Notes |
|---|---|---|
| company | jsonb | translatable |
| role | jsonb | translatable |
| description | jsonb | translatable |
| startDate | text | NOT translatable (ISO date) |
| endDate | text | nullable, NOT translatable |
| current | boolean | NOT translatable |
| sortOrder | integer | NOT translatable |

### Education
| Field | Type | Notes |
|---|---|---|
| school | jsonb | translatable |
| degree | jsonb | translatable |
| field | jsonb | translatable |
| startDate | text | NOT translatable |
| endDate | text | nullable, NOT translatable |

### Projects
| Field | Type | Notes |
|---|---|---|
| title | jsonb | translatable |
| slug | text | NOT translatable (URL key) |
| description | jsonb | translatable |
| techStack | text[] | NOT translatable (array of English tags) |
| liveUrl | text | nullable, NOT translatable |
| repoUrl | text | nullable, NOT translatable |
| screenshots | text[] | NOT translatable |
| status | text | NOT translatable |
| sortOrder | integer | NOT translatable |

### Skills
| Field | Type | Notes |
|---|---|---|
| name | jsonb | translatable |
| category | text | NOT translatable |

---

## 4. i18n File Structure

```
public/locales/
  en/
    common.json      # Nav, footer, cta, etc.
  pt/
    common.json      # Portuguese translation of same keys
```

Profile/experience/education/project content comes from the database (JSONB), not translation files.

---

## 5. Admin Editor Changes

All editors (`AboutEditor`, `ProjectsEditor`, `Settings`) get a language tab switcher above the form:

```
[🇬🇧 English] [🇧🇷 Português]
```

When "English" tab is active → form fields show/edit `field.en`
When "Português" tab is active → form fields show/edit `field.pt`

Implementation approach:
- Wrap `CrudForm` in a `TabbedTranslatableForm` component that handles the tab state
- Each tab shows the same fields but with different language keys extracted from the JSONB values
- `CrudForm` defaultValues and onSubmit data shape: `{ fieldName: { en: "", pt: "" } }`

### Schema Changes
- `profileSchema` in AboutEditor/Settings: all text fields become `z.object({ en: z.string(), pt: z.string() })`
- Same pattern for experienceSchema, educationSchema, projectSchema
- Zod schemas update to reflect JSONB structure

### Loading Data
- When loading existing records, reconstruct the JSONB shape from individual columns (if columns are split) OR read JSONB directly if columns are already JSONB
- Since we're switching to JSONB, Supabase returns the object directly

### Saving Data
- `onSubmit` sends the full `{ en: "", pt: "" }` object to Supabase as JSONB
- No need to split into separate columns

---

## 6. Public Site Changes

### Header
- Add language toggle button (e.g., "EN | PT" or flag icons)
- Toggles `i18n.changeLanguage()`

### Page Rendering
- Use `useTranslation()` hook in each public page
- `const { t, i18n } = useTranslation()` — `t('common.key')` for UI strings
- Database content accessed via hooks — already returns JSONB, extract current language:

```ts
function getLocalized(value: string | Record<string, string> | null, lang: string): string {
  if (typeof value === 'object' && value !== null) {
    return value[lang] ?? value.en ?? '';
  }
  return typeof value === 'string' ? value : '';
}
```

This defensive helper handles malformed JSONB gracefully. If a field is `null`, `{}`, or missing a language key, it falls back to English.

### Contact Page
- Form heading, subheading, labels, placeholders, success/error messages — all in `common.json` translation files
- Admin-facing validation error messages stay in code (English only)

---

## 7. Seed Data Migration

- Write a one-time migration SQL to convert existing `text` columns to JSONB
- Old English value becomes `{ en: "value", pt: "" }` (PT left empty to fill later)
- Use `COALESCE(column, '')` to safely handle NULLs during conversion
- Each JSONB column must be NOT NULL with a default of `'{}'::jsonb`

Example conversion pattern for profile name:
```sql
ALTER TABLE profile
ALTER COLUMN name TYPE jsonb
USING to_jsonb(COALESCE(name, ''));
```

After migration, run `UPDATE profile SET name = jsonb_build_object('en', name->>'en', 'pt', '')` if the intermediate type doesn't produce the right shape.

---

## 8. Language in Settings

Add a `language` field to profile — allows admin to set a default language for the public site (overridden by user toggle if they manually select).

---

## 9. Files to Change

### New files
- `src/i18n.ts` — i18next configuration
- `src/components/admin/TabbedTranslatableForm/index.tsx` — tab wrapper for CrudForm
- `src/components/admin/SkillsEditor/index.tsx` — CRUD for skills with language tabs
- `src/components/admin/SkillsEditor/styles.module.css`
- `public/locales/en/common.json` — UI strings (nav, footer, cta, contact form labels, etc.)
- `public/locales/pt/common.json` — Portuguese translations
- `supabase/migrations/002_add_i18n.sql` — JSONB migration + RLS

### Modified files
- `src/types/index.ts` — update field types to JSONB shapes
- `src/pages/admin/AboutEditor/index.tsx` — tabbed UI, new schemas
- `src/pages/admin/ProjectsEditor/index.tsx` — tabbed UI, new schemas
- `src/pages/admin/Settings/index.tsx` — tabbed UI, new schemas
- `src/pages/admin/Dashboard/index.tsx` — add SkillsEditor link to nav
- `src/pages/public/Home/index.tsx` — useTranslation hook, language-aware DB rendering
- `src/pages/public/About/index.tsx` — same, plus useSkills hook
- `src/pages/public/Projects/index.tsx` — same
- `src/pages/public/Contact/index.tsx` — translate UI strings via common.json
- `src/components/public/Header/index.tsx` — add language toggle
- `src/components/public/Layout/index.tsx` — wrap with i18next provider
- `src/hooks/useAboutData.ts` — update to match new JSONB schema
- `src/hooks/useProjects.ts` — update to match new JSONB schema
- `src/hooks/useProfile.ts` — update to match new JSONB schema
- `src/hooks/useSkills.ts` — new hook for skills data

---

## 10. Non-Goals (Out of Scope)

- Translating URLs, slugs, or technical values
- RTL language support
- Pluralization (i18next features not needed for portfolio)
- Language in admin dashboard UI (dashboard stays English-only)

---

## 11. RLS Policy Note

Supabase RLS operates at the row level, not column level — no changes needed to existing RLS policies. JSONB column access is transparent to RLS.

---

## 12. Admin Skills Editor

The `SkillsEditor` component provides CRUD for skills with the same tabbed language pattern. Tech stack tags in projects are NOT translatable (they reference skills by name). When rendering project tech stack, use the localized skill name from the skills table if available, falling back to the raw string.
