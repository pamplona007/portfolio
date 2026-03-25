# i18n Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add i18next (EN/PT) for all UI strings and bilingual content (EN/PT) for all CMS text fields via JSONB columns in Supabase.

**Architecture:** i18next + react-i18next with browser language detection. All CMS text fields use JSONB `{ en: string, pt: string }`. Admin editors use tabbed UI (EN/PT tabs) to edit each language separately. Public pages render database content using the current UI language.

**Tech Stack:** i18next, react-i18next, i18next-browser-languagedetector

---

## Dependencies

Install i18next packages before starting:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

---

## Task 1: i18n Configuration

**Files:**
- Create: `src/i18n.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create i18n configuration**

Create `src/i18n.ts`:

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en/common.json';
import pt from '../public/locales/pt/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      pt: { common: pt },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
```

- [ ] **Step 2: Add locales directory and English file**

Create `public/locales/en/common.json`:

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "projects": "Projects",
    "contact": "Contact"
  },
  "home": {
    "viewProjects": "View Projects",
    "getInTouch": "Get in Touch",
    "yearsExp": "Years Experience",
    "projectsDelivered": "Projects Delivered",
    "yearsAtWeavel": "Years at Weavel"
  },
  "about": {
    "skills": "Skills",
    "experience": "Experience",
    "education": "Education",
    "present": "Present"
  },
  "projects": {
    "title": "My Projects",
    "subtitle": "A selection of things I've built — from side projects to production systems.",
    "all": "All",
    "noResults": "No projects match the selected filter."
  },
  "contact": {
    "title": "Get in Touch",
    "subtitle": "Have a project in mind or just want to chat? Drop me a message.",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "namePlaceholder": "Your name",
    "emailPlaceholder": "you@example.com",
    "messagePlaceholder": "Tell me about your project...",
    "send": "Send Message",
    "successTitle": "Message sent!",
    "successText": "Thanks for reaching out. I'll get back to you as soon as possible.",
    "sendAnother": "Send another message",
    "infoTitle": "Other ways to reach me",
    "infoText": "Prefer a more direct approach? Find me on GitHub, LinkedIn, or send an email."
  },
  "footer": {
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 3: Create Portuguese translation file**

Create `public/locales/pt/common.json` — same keys with PT values:

```json
{
  "nav": {
    "home": "Início",
    "about": "Sobre",
    "projects": "Projetos",
    "contact": "Contato"
  },
  "home": {
    "viewProjects": "Ver Projetos",
    "getInTouch": "Entre em Contato",
    "yearsExp": "Anos de Experiência",
    "projectsDelivered": "Projetos Entregues",
    "yearsAtWeavel": "Anos na Weavel"
  },
  "about": {
    "skills": "Habilidades",
    "experience": "Experiência",
    "education": "Educação",
    "present": "Atual"
  },
  "projects": {
    "title": "Meus Projetos",
    "subtitle": "Uma seleção de coisas que construí — de projetos pessoais a sistemas em produção.",
    "all": "Todos",
    "noResults": "Nenhum projeto corresponde ao filtro selecionado."
  },
  "contact": {
    "title": "Entre em Contato",
    "subtitle": "Tem um projeto em mente ou quer trocar uma ideia? Mande uma mensagem.",
    "name": "Nome",
    "email": "E-mail",
    "message": "Mensagem",
    "namePlaceholder": "Seu nome",
    "emailPlaceholder": "voce@exemplo.com",
    "messagePlaceholder": "Conte-me sobre seu projeto...",
    "send": "Enviar Mensagem",
    "successTitle": "Mensagem enviada!",
    "successText": "Obrigado pelo contato. Vou responder assim que possível.",
    "sendAnother": "Enviar outra mensagem",
    "infoTitle": "Outras formas de me encontrar",
    "infoText": "Prefere uma abordagem mais direta? Me encontre no GitHub, LinkedIn ou envie um e-mail."
  },
  "footer": {
    "rights": "Todos os direitos reservados."
  }
}
```

- [ ] **Step 4: Update main.tsx to include i18n provider**

Modify `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';  // ← add this import
import './styles/global.css';
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n.ts src/main.tsx public/locales/
git commit -m "feat(i18n): add i18next configuration and locale files"
```

---

## Task 2: Update Types for JSONB Schema

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add LocalizedString type and update types**

Replace the entire `src/types/index.ts` with:

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(i18n): update types to LocalizedString JSONB schema"
```

---

## Task 3: Fix sortOrder Column Name + Update Hooks for JSONB Schema

**Files:**
- Modify: `src/hooks/useProfile.ts`
- Modify: `src/hooks/useAboutData.ts`
- Modify: `src/hooks/useProjects.ts`
- Create: `src/hooks/useSkills.ts`

- [ ] **Step 1: Rewrite useProfile.ts**

Replace `src/hooks/useProfile.ts` with:

```ts
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Profile } from '@/types';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProfile(data);
        setLoading(false);
      });
  }, []);

  return { profile, loading, error };
}
```

- [ ] **Step 2: Rewrite useAboutData.ts**

Replace `src/hooks/useAboutData.ts` with:

```ts
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Profile, Experience, Education, Skill } from '@/types';

export function useAboutData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, expRes, eduRes, skillRes] = await Promise.all([
          supabase.from('profile').select('*').single(),
          supabase.from('experience').select('*').order('sortOrder'),
          supabase.from('education').select('*'),
          supabase.from('skills').select('*'),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (profileRes.data) setProfile(profileRes.data);
        if (expRes.data) setExperiences(expRes.data);
        if (eduRes.data) setEducation(eduRes.data);
        if (skillRes.data) setSkills(skillRes.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load data';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { profile, experiences, education, skills, loading, error };
}
```

- [ ] **Step 3: Rewrite useProjects.ts**

Replace `src/hooks/useProjects.ts` with:

```ts
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Project } from '@/types';

export function useProjects(status?: 'active' | 'inactive') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase.from('projects').select('*').order('sortOrder');
    if (status) query = query.eq('status', status);

    query.then(({ data, error }) => {
      if (error) setError(error.message);
      else setProjects(data ?? []);
      setLoading(false);
    });
  }, [status]);

  return { projects, loading, error };
}
```

- [ ] **Step 4: Fix sortOrder column name (pre-existing bug)**

The existing codebase incorrectly uses `sort_order` (underscore) in Supabase queries, but the actual column name is `sortOrder` (camelCase). Fix all three files:

In `src/hooks/useProjects.ts`:
```ts
.order('sortOrder')
```

In `src/pages/admin/ProjectsEditor/index.tsx`:
```ts
.order('sortOrder')
// and:
.insert([{ ...data, sortOrder: projects.length }])
```

In `src/pages/admin/AboutEditor/index.tsx`:
```ts
.order('sortOrder'),
```

- [ ] **Step 5: Create useSkills.ts**

Create `src/hooks/useSkills.ts`:

```ts
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Skill } from '@/types';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setSkills(data ?? []);
        setLoading(false);
      });
  }, []);

  return { skills, loading, error };
}
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useProfile.ts src/hooks/useAboutData.ts src/hooks/useProjects.ts src/hooks/useSkills.ts src/pages/admin/AboutEditor/index.tsx src/pages/admin/ProjectsEditor/index.tsx
git commit -m "feat(i18n): update hooks for JSONB schema + fix sortOrder column name"
```

---

## Task 4: TabbedTranslatableForm Component

**Files:**
- Create: `src/components/admin/TabbedTranslatableForm/index.tsx`
- Create: `src/components/admin/TabbedTranslatableForm/styles.module.css`

The key design challenge: when switching tabs (EN→PT), any unsaved values in the current tab must be preserved in the full `{ en, pt }` data object. The form must re-initialize with the new language's values without losing the other language's data.

Solution: `TabbedTranslatableForm` maintains the full localized object in React state (`localizedData`). On tab switch, it:
1. Reads the current form values via `formRef`
2. Merges them into `localizedData`
3. Calls `form.reset(localizedData[newLang])` to show the new language

`CrudForm` is extended to accept a `formRef` prop so `TabbedTranslatableForm` can call `reset()` on it.

- [ ] **Step 1: Update CrudForm to support formRef**

Modify `src/components/admin/CrudForm/index.tsx`. Add to imports:

```tsx
import { useForm, Path, FormProvider } from 'react-hook-form';
```

Add `formRef` to the interface and wrap with `FormProvider`:

```tsx
interface CrudFormProps<T extends z.ZodType> {
  // ... existing fields
  formRef?: ReturnType<typeof useForm>;
}
```

Wrap the form JSX with a `FormProvider` and pass the form instance:

```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues,
});

const combinedProps = { ...props, form };

// Pass form via context
return (
  <FormProvider {...form}>
    <form onSubmit={handleSubmit(onSubmit)} ...>
```

Actually, since `CrudForm` creates its own `useForm` internally, we need to use `useImperativeHandle` to expose the form, or better: pass `formRef` as a prop and use `useEffect` to call `reset` when defaultValues change.

**Simpler approach — use `key` to remount:**

Instead of trying to expose the form instance, use a `formKey` state that changes on tab switch. When `formKey` changes, the `CrudForm` remounts with fresh `defaultValues` set to the new language's values.

```tsx
// In TabbedTranslatableForm:
const [formKey, setFormKey] = useState('en');

const handleTabSwitch = (newLang: Language) => {
  // Merge current form values into localizedData before switching
  const currentValues = formRef.current?.getValues();
  if (currentValues) {
    setLocalizedData(prev => ({ ...prev, [activeLang]: currentValues }));
  }
  setActiveLang(newLang);
  setFormKey(newLang); // triggers CrudForm remount
};
```

The `CrudForm` receives `defaultValues` that are derived from `localizedData[activeLang]`. Since `defaultValues` only apply at mount time, the key-based remount ensures new values are picked up.

- [ ] **Step 2: Create TabbedTranslatableForm with key-based remount**

Create `src/components/admin/TabbedTranslatableForm/index.tsx`:

```tsx
import { useState, useRef } from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';
import styles from './styles.module.css';

export type Language = 'en' | 'pt';

interface TabbedTranslatableFormProps<T extends ZodType> {
  schema: T;
  defaultValues: Record<string, unknown>;
  fields: Array<{
    name: string;
    label: string;
    type?: 'text' | 'email' | 'url' | 'textarea' | 'select';
    placeholder?: string;
    options?: { value: string; label: string }[];
    rows?: number;
  }>;
  onSubmit: (data: Record<string, unknown>, lang: Language) => void;
  onCancel?: () => void;
  submitLabel?: string;
  localizedData: Record<string, Record<string, unknown>>;
  onLocalizedDataChange: (data: Record<string, Record<string, unknown>>) => void;
  children?: React.ReactNode;
}

export function TabbedTranslatableForm<T extends ZodType>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  localizedData,
  onLocalizedDataChange,
}: TabbedTranslatableFormProps<T>) {
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [formKey, setFormKey] = useState(activeLang);
  const formRef = useRef<UseFormReturn | null>(null);

  const handleTabSwitch = (newLang: Language) => {
    if (newLang === activeLang) return;
    // Read current form values before switching
    const currentValues = formRef.current?.getValues();
    if (currentValues) {
      onLocalizedDataChange({ ...localizedData, [activeLang]: currentValues });
    }
    setActiveLang(newLang);
    setFormKey(newLang);
  };

  const currentLangDefaultValues = (() => {
    const merged = { ...defaultValues, ...localizedData[activeLang] };
    return merged;
  })();

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeLang === 'en' ? styles.active : ''}`}
          onClick={() => handleTabSwitch('en')}
        >
          🇬🇧 English
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeLang === 'pt' ? styles.active : ''}`}
          onClick={() => handleTabSwitch('pt')}
        >
          🇧🇷 Português
        </button>
      </div>
      <div className={styles.content}>
        <TabbedCrudFormInner
          key={formKey}
          schema={schema}
          defaultValues={currentLangDefaultValues}
          fields={fields}
          onSubmit={onSubmit}
          onCancel={onCancel}
          submitLabel={submitLabel}
          activeLang={activeLang}
          onFormReady={(form) => { formRef.current = form; }}
        />
      </div>
    </div>
  );
}

interface InnerProps<T extends ZodType> {
  schema: T;
  defaultValues: Record<string, unknown>;
  fields: TabbedTranslatableFormProps<T>['fields'];
  onSubmit: (data: Record<string, unknown>, lang: Language) => void;
  onCancel?: () => void;
  submitLabel?: string;
  activeLang: Language;
  onFormReady: (form: UseFormReturn) => void;
}

import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import innerStyles from './crudForm.module.css';

function TabbedCrudFormInner<T extends ZodType>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  activeLang,
  onFormReady,
}: InnerProps<T>) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    onFormReady(form);
  }, []);

  const handleSubmit = (data: Record<string, unknown>) => {
    onSubmit(data, activeLang);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={innerStyles.form}>
      {fields.map((field) => (
        <div key={field.name} className={innerStyles.field}>
          <label htmlFor={field.name} className={innerStyles.label}>
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              rows={field.rows ?? 4}
              className={`${innerStyles.textarea} ${form.formState.errors[field.name as keyof typeof form.formState.errors] ? innerStyles.inputError : ''}`}
              placeholder={field.placeholder}
              {...form.register(field.name as Path<z.infer<T>>)}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              className={`${innerStyles.select} ${form.formState.errors[field.name as keyof typeof form.formState.errors] ? innerStyles.inputError : ''}`}
              {...form.register(field.name as Path<z.infer<T>>)}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type ?? 'text'}
              className={`${innerStyles.input} ${form.formState.errors[field.name as keyof typeof form.formState.errors] ? innerStyles.inputError : ''}`}
              placeholder={field.placeholder}
              {...form.register(field.name as Path<z.infer<T>>)}
            />
          )}
          {form.formState.errors[field.name as keyof typeof form.formState.errors] && (
            <span className={innerStyles.error}>
              {String(form.formState.errors[field.name as keyof typeof form.formState.errors]?.message)}
            </span>
          )}
        </div>
      ))}
      <div className={innerStyles.actions}>
        {onCancel && (
          <button type="button" className={innerStyles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={innerStyles.submitBtn} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create CSS for TabbedTranslatableForm**

Create `src/components/admin/TabbedTranslatableForm/styles.module.css`:

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--color-glass-border, rgba(255,255,255,0.06));
  padding-bottom: 0.5rem;
}

.tab {
  padding: 0.375rem 0.875rem;
  border-radius: 6px 6px 0 0;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-secondary, #9ca3af);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab:hover {
  color: var(--color-text, #f3f4f6);
  background: rgba(255,255,255,0.04);
}

.tab.active {
  color: var(--color-primary, #ff6b35);
  border-color: rgba(255,255,255,0.06);
  border-bottom-color: transparent;
  background: rgba(255,107,53,0.08);
}

.content {
  padding-top: 0.5rem;
}
```

Also add `crudForm.module.css` reference in the inner component (or reuse the existing CrudForm styles).

Actually, to avoid duplicating the form styles, just use `CrudForm` inside `TabbedTranslatableForm` but pass a ref via a context. But given the complexity, the simplest working solution is to make `CrudForm` accept a `formKey` prop that triggers remount — use `useEffect` in CrudForm to call `form.reset(defaultValues)` when `formKey` changes.

**Simplest approach for the plan — update CrudForm with formKey:**

Modify `CrudForm` to accept an optional `formKey?: string` prop. Add `useEffect(() => { form.reset(defaultValues); }, [formKey, defaultValues]);`. This lets TabbedTranslatableForm pass the active language as `formKey`, causing a reset on tab switch.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/TabbedTranslatableForm/
git commit -m "feat(i18n): add TabbedTranslatableForm with key-based tab switching"
```

---

## Task 5: Header Language Toggle

**Files:**
- Modify: `src/components/public/Header/index.tsx`
- Modify: `src/components/public/Header/styles.module.css`

- [ ] **Step 1: Read current Header**

```bash
cat src/components/public/Header/index.tsx
```

- [ ] **Step 2: Add language toggle to nav**

In the Header component, add a language toggle button. Add these imports:

```tsx
import { useTranslation } from 'react-i18next';
```

Add the toggle button in the nav section (before or after social links):

```tsx
const { i18n } = useTranslation();
const currentLang = i18n.language;

const toggleLang = () => {
  i18n.changeLanguage(currentLang === 'en' ? 'pt' : 'en');
};
```

Add a toggle button in the nav:

```tsx
<button onClick={toggleLang} className={styles.langToggle} aria-label="Toggle language">
  {currentLang === 'en' ? '🇧🇷 PT' : '🇬🇧 EN'}
</button>
```

Add the CSS for `.langToggle` to `styles.module.css`:

```css
.langToggle {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.langToggle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/public/Header/index.tsx src/components/public/Header/styles.module.css
git commit -m "feat(i18n): add language toggle to public header"
```

---

## Task 6: Layout i18n Provider

**Files:**
- Modify: `src/components/public/Layout/index.tsx`

- [ ] **Step 1: Wrap Layout children with I18nextProvider**

```tsx
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
```

Wrap the `{children}` output with `<I18nextProvider i18n={i18n}>`.

```tsx
<I18nextProvider i18n={i18n}>
  <div className={styles.layout}>
    <Header />
    <main className={styles.main}>
      {children}
    </main>
    <Footer />
  </div>
</I18nextProvider>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/public/Layout/index.tsx
git commit -m "feat(i18n): wrap public layout with i18next provider"
```

---

## Task 7: Public Pages — Language-Aware Rendering

**Files:**
- Modify: `src/pages/public/Home/index.tsx`
- Modify: `src/pages/public/About/index.tsx`
- Modify: `src/pages/public/Projects/index.tsx`
- Modify: `src/pages/public/Contact/index.tsx`

- [ ] **Step 1: Update Home page**

Add to imports:
```tsx
import { useTranslation } from 'react-i18next';
import { getLocalized } from '@/types';
```

Add inside component:
```tsx
const { i18n } = useTranslation();
const lang = i18n.language;
```

Replace hardcoded values with `getLocalized` calls:
```tsx
<span className={`${styles.eyebrow} reveal`}>
  {loading ? '' : getLocalized(profile?.title, lang)}
</span>
<h1 className={`${styles.name} reveal`} style={{ animationDelay: '100ms' }}>
  <span className="gradient-text">{getLocalized(profile?.name, lang)}</span>
</h1>
<p className={`${styles.title} reveal`} style={{ animationDelay: '200ms' }}>
  {getLocalized(profile?.title, lang)}
</p>
<p className={`${styles.tagline} reveal`} style={{ animationDelay: '300ms' }}>
  {getLocalized(profile?.tagline, lang)}
</p>
```

Social links still use hardcoded URLs from profile (not translated).

- [ ] **Step 2: Update About page**

Add imports:
```tsx
import { useTranslation } from 'react-i18next';
import { getLocalized } from '@/types';
```

Add inside component:
```tsx
const { i18n } = useTranslation();
const lang = i18n.language;
```

Replace hardcoded bio, experience, education, skills with dynamic data using `getLocalized`:
```tsx
<p className={styles.bio}>{getLocalized(profile?.bio, lang)}</p>

{experiences.map((exp) => (
  <div key={exp.id} className={styles.timelineItem}>
    ...
    <h3 className={styles.role}>{getLocalized(exp.role, lang)}</h3>
    <p className={styles.company}>{getLocalized(exp.company, lang)}</p>
    {exp.description && <p className={styles.description}>{getLocalized(exp.description, lang)}</p>}
  </div>
))}

{education.map((edu) => (
  ...
  <h3 className={styles.role}>{getLocalized(edu.degree, lang)}</h3>
  <p className={styles.company}>{getLocalized(edu.school, lang)}</p>
))}

{skills.map((skill) => (
  <SkillChip key={skill.id} name={getLocalized(skill.name, lang)} category={skill.category} />
))}
```

For period strings (e.g. "2022 — Present"), use:
```tsx
const formatPeriod = (startDate: string, endDate: string | null, current: boolean) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const presentLabel = lang === 'pt' ? 'Atual' : 'Present';
  const start = new Date(startDate).getFullYear();
  const end = current ? presentLabel : endDate ? new Date(endDate).getFullYear() : '';
  return `${start} — ${end}`;
};
```

Note: `formatPeriod` should be defined outside the component or use `useTranslation` at component level and pass the label inline. Better approach — define it as a pure function that takes the present label as a parameter:

```tsx
const getPresentLabel = (lang: string) => lang === 'pt' ? 'Atual' : 'Present';

const formatPeriod = (startDate: string, endDate: string | null, current: boolean, lang: string) => {
  const start = new Date(startDate).getFullYear();
  const end = current ? getPresentLabel(lang) : endDate ? new Date(endDate).getFullYear() : '';
  return `${start} — ${end}`;
};
```

- [ ] **Step 3: Update Projects page**

Add imports:
```tsx
import { useTranslation } from 'react-i18next';
import { getLocalized } from '@/types';
```

Add inside component:
```tsx
const { i18n } = useTranslation();
const lang = i18n.language;
```

Replace hardcoded project data:
```tsx
<h1 className={styles.heading}>
  My <span className="gradient-text">Projects</span>
</h1>
```

Use `t()` for UI strings and `getLocalized` for project data:
```tsx
<h1 className={styles.heading}>
  {t('projects.title').split(' ')[0]} <span className="gradient-text">{t('projects.title').split(' ')[1]}</span>
</h1>
```

Or better — use `t('projects:title')` pattern and make the heading translatable. Since project titles come from DB, use `getLocalized(project.title, lang)`.

Also update the filter buttons:
```tsx
<Button variant={filter === null ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter(null)}>
  {t('projects.all')}
</Button>
```

- [ ] **Step 4: Update Contact page**

Replace all hardcoded strings with `t()` calls:

```tsx
const { t } = useTranslation();
```

```tsx
<h1 className={styles.heading}>
  {t('contact.title').split(' ')[0]} <span className="gradient-text">{t('contact.title').split(' ').slice(1).join(' ')}</span>
</h1>
<p className={styles.subheading}>{t('contact.subtitle')}</p>

<label htmlFor="name" className={styles.label}>{t('contact.name')}</label>
<input ... placeholder={t('contact.namePlaceholder')} ... />

<Button type="submit" variant="primary" size="lg" loading={loading}>
  <Send size={16} />
  {t('contact.send')}
</Button>

// Success state
<h2 className={styles.successTitle}>{t('contact.successTitle')}</h2>
```

For info panel:
```tsx
<h3 className={styles.infoTitle}>{t('contact.infoTitle')}</h3>
<p className={styles.infoText}>{t('contact.infoText')}</p>
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/public/Home/index.tsx src/pages/public/About/index.tsx src/pages/public/Projects/index.tsx src/pages/public/Contact/index.tsx
git commit -m "feat(i18n): wire public pages with useTranslation and getLocalized"
```

---

## Task 8: Admin Editors — Tabbed Language Forms

**Files:**
- Modify: `src/pages/admin/AboutEditor/index.tsx`
- Modify: `src/pages/admin/ProjectsEditor/index.tsx`
- Modify: `src/pages/admin/Settings/index.tsx`
- Modify: `src/components/admin/CrudForm/index.tsx` (add `submitLabel` prop support already present)

This is the most complex task. Each editor needs to:
1. Import `TabbedTranslatableForm`
2. Wrap the form fields in `TabbedTranslatableForm`
3. Pass the active language to `CrudForm` so it shows the right value
4. Update Zod schemas to use `z.object({ en: z.string(), pt: z.string() })`

### AboutEditor Changes

**Import additions:**
```tsx
import { TabbedTranslatableForm } from '@/components/admin/TabbedTranslatableForm';
import type { LocalizedString } from '@/types';
```

**Update Zod schemas** — each translatable field becomes a `{ en: string, pt: string }` object:

```ts
const localizedString = z.object({
  en: z.string(),
  pt: z.string(),
});

const profileSchema = z.object({
  name: localizedString,
  title: localizedString,
  tagline: localizedString.nullish(),
  bio: localizedString.nullish(),
  socialGithub: z.string().url().nullish().or(z.literal('')),
  socialLinkedin: z.string().url().nullish().or(z.literal('')),
  socialEmail: z.string().email().nullish().or(z.literal('')),
});

const experienceSchema = z.object({
  company: localizedString,
  role: localizedString,
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: localizedString.nullish(),
});

const educationSchema = z.object({
  school: localizedString,
  degree: localizedString,
  field: localizedString,
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});
```

**Update `defaultValues` in Experience Modal** — convert flat data to nested language objects:

When editing, `editingExp` has `{ company: { en: "...", pt: "..." } }` directly from Supabase JSONB.

When creating new:
```ts
{
  company: { en: '', pt: '' },
  role: { en: '', pt: '' },
  startDate: '', endDate: '', current: false,
  description: { en: '', pt: '' },
}
```

**Wrap the CrudForm in TabbedTranslatableForm:**

In each modal (Profile, Experience, Education), wrap the `CrudForm` with `TabbedTranslatableForm`. Pass `activeLang` to control which language is shown:

```tsx
<TabbedTranslatableForm>
  {(lang) => (
    <CrudForm
      schema={profileSchema}
      defaultValues={profile ? {
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline,
        bio: profile.bio,
        socialGithub: profile.socialGithub ?? '',
        socialLinkedin: profile.socialLinkedin ?? '',
        socialEmail: profile.socialEmail ?? '',
      } : { name: { en: '', pt: '' }, title: { en: '', pt: '' }, ... }}
      fields={[
        { name: `name.${lang}`, label: 'Name' },  // ← field name uses interpolation
        { name: `title.${lang}`, label: 'Title' },
        // etc.
      ]}
      onSubmit={handleProfileSave}
      onCancel={() => setProfileModalOpen(false)}
    />
  )}
</TabbedTranslatableForm>
```

Note: The field `name` approach above (`name.${lang}`) won't work with react-hook-form's `register`. Instead, use the `defaultValues` to pre-populate the form with only the active language's values, and store the full `{ en, pt }` object in state, merging on tab switch.

**Better approach for TabbedTranslatableForm:**

Don't use per-language field names. Instead:
1. `TabbedTranslatableForm` maintains the active language in state
2. `CrudForm` receives `defaultValues` pre-scoped to the active language (e.g., `{ name: profile.name[lang] }` for display)
3. On submit, reconstruct the full `{ en, pt }` by reading from form values and existing data

This is complex. The cleanest implementation:

```tsx
<TabbedTranslatableForm>
  {(activeLang) => (
    <CrudForm
      schema={localizedStringSchema} // { en: string, pt: string } per field
      defaultValues={getDefaultsForLang(existingData, activeLang)}
      fields={[...fields.map(f => ({ ...f, name: `${f.name}.${activeLang}` }))]}
      onSubmit={(data) => handleSave(data, activeLang)}
    />
  )}
</TabbedTranslatableForm>
```

Where `getDefaultsForLang` extracts `field[activeLang]` from existing data for display.

### ProjectsEditor Changes

Same pattern: wrap `CrudForm` in `TabbedTranslatableForm`. Only `title` and `description` are localized — `slug`, `techStack`, URLs, status stay as plain strings.

```ts
const projectSchema = z.object({
  title: localizedString,
  slug: z.string().min(1),
  description: localizedString,
  techStack: z.string(), // comma-separated string (stored as string in DB, not JSONB)
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  screenshots: z.string(),
  status: z.enum(['active', 'inactive']),
});
```

### Settings Changes

Same as AboutEditor profile section — only profile fields are in Settings.

- [ ] **Step: Commit after each editor is updated**

```bash
git add src/pages/admin/AboutEditor/index.tsx
git commit -m "feat(i18n): update AboutEditor with tabbed language forms"

git add src/pages/admin/ProjectsEditor/index.tsx
git commit -m "feat(i18n): update ProjectsEditor with tabbed language forms"

git add src/pages/admin/Settings/index.tsx
git commit -m "feat(i18n): update Settings with tabbed language forms"
```

---

## Task 9: SkillsEditor Component

**Files:**
- Create: `src/components/admin/SkillsEditor/index.tsx`
- Create: `src/components/admin/SkillsEditor/styles.module.css`
- Modify: `src/components/admin/DashboardLayout/index.tsx` (add Skills nav item)
- Modify: `src/App.tsx` (add skills route)

- [ ] **Step 1: Create SkillsEditor**

Create `src/components/admin/SkillsEditor/index.tsx` with the same pattern as AboutEditor:

```tsx
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Modal } from '@/components/admin/Modal';
import { CrudForm } from '@/components/admin/CrudForm';
import { TabbedTranslatableForm } from '@/components/admin/TabbedTranslatableForm';
import { z } from 'zod';
import type { Skill } from '@/types';
import styles from './styles.module.css';

const localizedString = z.object({
  en: z.string(),
  pt: z.string(),
});

const skillSchema = z.object({
  name: localizedString,
  category: z.enum(['frontend', 'backend', 'devops', 'tools']),
});

export function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => { loadSkills(); }, []);

  async function loadSkills() {
    const { data } = await supabase.from('skills').select('*');
    if (data) setSkills(data);
    setLoading(false);
  }

  const handleSave = async (formData: z.infer<typeof skillSchema>, _lang: string) => {
    if (editingSkill) {
      await supabase.from('skills').update(formData).eq('id', editingSkill.id);
      setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, ...formData } : s));
    } else {
      const { data: newSkill } = await supabase.from('skills').insert([formData]).select().single();
      if (newSkill) setSkills([...skills, newSkill]);
    }
    setModalOpen(false);
    setEditingSkill(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id);
    setSkills(skills.filter(s => s.id !== id));
  };

  const categories = ['frontend', 'backend', 'devops', 'tools'] as const;

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Skills</h1>
        <button className={styles.addBtn} onClick={() => { setEditingSkill(null); setModalOpen(true); }}>
          <Plus size={14} /> Add
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map(cat => (
          <div key={cat} className={styles.categoryGroup}>
            <h2 className={styles.categoryTitle}>{cat}</h2>
            <div className={styles.skillList}>
              {skills.filter(s => s.category === cat).map(skill => (
                <div key={skill.id} className={styles.skillItem}>
                  <span className={styles.skillName}>
                    {skill.name.en || skill.name.pt}
                  </span>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => { setEditingSkill(skill); setModalOpen(true); }}>
                      <Pencil size={14} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(skill.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditingSkill(null); }}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
      >
        <TabbedTranslatableForm>
          {(lang) => (
            <CrudForm
              schema={skillSchema}
              defaultValues={editingSkill ? editingSkill.name : { en: '', pt: '' }}
              fields={[
                { name: `name.${lang}`, label: 'Name' },
              ]}
              onSubmit={(data) => handleSave(data, lang)}
              onCancel={() => { setModalOpen(false); setEditingSkill(null); }}
            />
          )}
        </TabbedTranslatableForm>
      </Modal>
    </div>
  );
}
```

Note: The above has an issue — `CrudForm` registers fields by name string, so `name.en` won't work directly. The TabbedTranslatableForm approach needs refinement.

**Revised TabbedTranslatableForm pattern for SkillsEditor:**

Since CrudForm uses `register(field.name)`, using `name.en` as a field name works with nested objects. React Hook Form supports nested field names like `name.en`.

The skill schema needs to use `z.object({ en: z.string(), pt: z.string() })` and fields use `name="name.en"` or `name="name.pt"`.

However, since the form has only ONE language active at a time, we show only the current language's field. We need to dynamically render fields based on active language.

**Revised SkillsEditor approach:**

```tsx
<TabbedTranslatableForm>
  {(activeLang) => {
    const nameField = `name.${activeLang}`;
    return (
      <CrudForm
        schema={skillSchema}
        defaultValues={editingSkill ? editingSkill.name : { en: '', pt: '' }}
        fields={[
          { name: nameField, label: 'Name' },
        ]}
        onSubmit={(data) => {
          // data is { name: { en: '', pt: '' }, category: 'frontend' }
          const payload = { name: data.name, category: data.category };
          if (editingSkill) {
            await supabase.from('skills').update(payload).eq('id', editingSkill.id);
            setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, ...payload } : s));
          } else {
            const { data: newSkill } = await supabase.from('skills').insert([payload]).select().single();
            if (newSkill) setSkills([...skills, newSkill]);
          }
          setModalOpen(false);
          setEditingSkill(null);
        }}
        onCancel={() => { setModalOpen(false); setEditingSkill(null); }}
      />
    );
  }}
</TabbedTranslatableForm>
```

- [ ] **Step 2: Add route for SkillsEditor**

Modify `src/App.tsx`:
```tsx
const SkillsEditor = React.lazy(() => import('./components/admin/SkillsEditor'));
```

Add route in admin section:
```tsx
<Route path="skills" element={<SkillsEditor />} />
```

- [ ] **Step 3: Add Skills link to DashboardLayout nav**

Modify `src/components/admin/DashboardLayout/index.tsx`:

Add to navItems array:
```tsx
{ to: '/dashboard/skills', icon: Star, label: 'Skills' },
```

Import `Star` from lucide-react.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/SkillsEditor/ src/pages/admin/Dashboard/index.tsx src/App.tsx src/components/admin/DashboardLayout/index.tsx
git commit -m "feat(i18n): add SkillsEditor component and route"
```

---

## Task 10: Database Migration

**Files:**
- Create: `supabase/migrations/002_add_i18n.sql`

- [ ] **Step 1: Write migration SQL**

This migration converts existing text columns to JSONB `{ en, pt }` objects. Since the existing columns contain English text, PT will be left as empty strings.

```sql
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

-- Verify the conversions worked (should return JSONB objects)
-- SELECT name FROM profile LIMIT 1;
-- SELECT company FROM experience LIMIT 1;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/002_add_i18n.sql
git commit -m "feat(i18n): add database migration for JSONB i18n columns"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Run `npm run build`** — must pass with 0 errors
- [ ] **Step 2: Run `npm run dev`** — verify app loads at localhost:5174
- [ ] **Step 3: Commit all remaining changes**

---

## Task Dependencies

```
Task 1 (i18n config + locale files)
    ↓
Task 2 (types) — unblocks all hooks and components
    ↓
Task 3 (hooks + sortOrder fix) — unblocks public pages and admin editors
    ↓
Task 4 (TabbedTranslatableForm)
    ↓
Task 5 (Header toggle) ← Task 1 first
Task 6 (Layout provider) ← Task 1 first
Task 7 (Public pages) ← Task 2 + 3 first
Task 8 (Admin editors) ← Task 4 + 2 + 3 first
Task 9 (SkillsEditor) ← Task 4 + 2 first
Task 10 (DB migration) — runs in Supabase whenever ready
Task 11 (Final verification) — after all above
```

Start with Task 1 → 2 → 3 → 4 in sequence. Tasks 5, 6, 7, 8, 9 can run in parallel after Task 4. Task 10 (DB migration) runs in Supabase whenever ready. Task 11 is the final check.
