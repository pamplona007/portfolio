import { createContext, useContext, useEffect, useState } from 'react';
import type { Profile, Project, Skill, Experience, Education } from '@/types';
import profileData from '@/data/profile.json';
import projectsData from '@/data/projects.json';
import skillsData from '@/data/skills.json';
import experiencesData from '@/data/experiences.json';
import educationData from '@/data/education.json';
import styles from './styles.module.css';

export interface PreloadedData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  isLoaded: boolean;
}

interface AppDataContextValue extends PreloadedData {}

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

type Phase = 'loading' | 'exiting' | 'done';

interface AppLoaderProps {
  children: React.ReactNode;
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function AppLoader({ children }: AppLoaderProps) {
  const [data, setData] = useState<PreloadedData | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      const loadedProjects = projectsData as unknown as Project[];

      const imageUrls = loadedProjects.flatMap((p): string[] => {
        const urls: string[] = [];
        if (p.coverImageUrl) urls.push(p.coverImageUrl);
        if (p.screenshots[0]) urls.push(p.screenshots[0]);
        return urls;
      });

      await Promise.all(imageUrls.map(preloadImage));

      if (cancelled) return;

      setData({
        profile: profileData as unknown as Profile,
        projects: loadedProjects,
        skills: skillsData as unknown as Skill[],
        experiences: experiencesData as unknown as Experience[],
        education: educationData as unknown as Education[],
        isLoaded: true,
      });

      setPhase('exiting');

      setTimeout(() => {
        setPageVisible(true);
        setPhase('done');
      }, 300);
    }

    preload();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppDataContext.Provider value={data ?? {
      profile: null,
      projects: [],
      skills: [],
      experiences: [],
      education: [],
      isLoaded: false,
    }}>
      <div
        className={`${styles.loaderWrapper} ${phase === 'done' ? styles.loaderHidden : ''} ${phase === 'exiting' ? styles.loaderExiting : ''}`}
        aria-hidden={phase === 'done'}
      >
        <LoaderScreen />
      </div>

      <div className={`${styles.pageWrapper} ${pageVisible ? styles.pageVisible : ''}`}>
        {children}
      </div>
    </AppDataContext.Provider>
  );
}

function LoaderScreen() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 120);
    return () => clearInterval(id);
  }, []);

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
