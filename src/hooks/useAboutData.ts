import { useAppData } from '@/components/public/AppLoader';
import type { Profile, Experience, Education, Skill } from '@/types';

export function useAboutData() {
  const { profile, experiences, education, skills, isLoaded } = useAppData() as {
    profile: Profile | null;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    isLoaded: boolean;
  };
  return { profile, experiences, education, skills, loading: !isLoaded, error: null };
}
