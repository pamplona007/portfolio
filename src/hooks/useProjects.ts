import { useAppData } from '@/components/public/AppLoader';

export function useProjects(status?: 'active' | 'inactive') {
  const { projects, isLoaded } = useAppData();
  const filtered = status ? projects.filter(p => p.status === status) : projects;
  return { projects: filtered, loading: !isLoaded, error: null };
}
