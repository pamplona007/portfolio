import { useAppData } from '@/components/public/AppLoader';

export function useProfile() {
  const { profile, isLoaded } = useAppData();
  return { profile, loading: !isLoaded, error: null };
}
