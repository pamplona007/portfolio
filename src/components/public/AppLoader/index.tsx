import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import type { Profile, Project, Skill, Experience, Education } from '@/types';
import { toCamelCase } from '@/utils/db';
import styles from './styles.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PreloadedData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  isLoaded: boolean;
}

interface AppDataContextValue extends PreloadedData {}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppDataContext = createContext<AppDataContextValue>({
  profile: null,
  projects: [],
  skills: [],
  experiences: [],
  education: [],
  isLoaded: false,
});

export function useAppData() {
  return useContext(AppDataContext);
}

// ─── AppLoader ────────────────────────────────────────────────────────────────

interface AppLoaderProps {
  children: React.ReactNode;
}

export function AppLoader({ children }: AppLoaderProps) {
  const [data, setData] = useState<PreloadedData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      const [profileRes, projectsRes, skillsRes, expRes, eduRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('projects').select('*').order('sortOrder'),
        supabase.from('skills').select('*'),
        supabase.from('experience').select('*').order('sortOrder'),
        supabase.from('education').select('*'),
      ]);

      if (cancelled) return;

      setData({
        profile: profileRes.data ? (toCamelCase(profileRes.data) as Profile) : null,
        projects: (projectsRes.data ?? []) as Project[],
        skills: (skillsRes.data ?? []) as Skill[],
        experiences: (expRes.data ?? []) as Experience[],
        education: (eduRes.data ?? []) as Education[],
        isLoaded: true,
      });
    }

    preload();

    return () => {
      cancelled = true;
    };
  }, []);

  // Render loading screen until data is ready
  if (!data) {
    return <LoaderScreen />;
  }

  return (
    <AppDataContext.Provider value={data}>
      {children}
    </AppDataContext.Provider>
  );
}

// ─── Hooks backed by preloaded context ───────────────────────────────────────

export function useProfileData() {
  const { profile } = useAppData();
  return profile;
}

export function useProjectsData() {
  const { projects } = useAppData();
  return projects;
}

export function useSkillsData() {
  const { skills } = useAppData();
  return skills;
}

export function useExperiencesData() {
  const { experiences } = useAppData();
  return experiences;
}

export function useEducationData() {
  const { education } = useAppData();
  return education;
}

// ─── Loader Screen ────────────────────────────────────────────────────────────

function LoaderScreen() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 120);
    return () => clearInterval(id);
  }, []);

  // Pulsing dots animation
  const dotCount = 3;
  const activeDots = Math.floor((tick % 20) / 7);

  return (
    <div className={styles.screen}>
      <div className={styles.orbContainer} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.mark}>
          <span className={styles.markChar} style={{ animationDelay: '0ms' }}>L</span>
          <span className={styles.markChar} style={{ animationDelay: '120ms' }}>P</span>
        </div>

        <p className={styles.name}>Lucas Pamplona</p>

        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>

        <p className={styles.progressText}>
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={i}
              className={styles.dot}
              style={{ opacity: i <= activeDots ? 1 : 0.25 }}
            />
          ))}
          <span className={styles.loadingLabel}>Loading</span>
        </p>
      </div>

      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />
    </div>
  );
}
