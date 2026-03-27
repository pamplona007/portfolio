import { useAppData } from '@/components/public/AppLoader';

export function useAboutData() {
  const { profile, experiences, education, skills, isLoaded } = useAppData();
  return { profile, experiences, education, skills, loading: !isLoaded, error: null };
}
