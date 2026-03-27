import { useAppData } from '@/components/public/AppLoader';

export function useProfile() {
  const { profile, isLoaded } = useAppData() as {
    profile: import('@/types').Profile | null;
    isLoaded: boolean;
  };
  return { profile, loading: !isLoaded, error: null };
}
