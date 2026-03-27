import { useAppData } from '@/components/public/AppLoader';
import type { Project } from '@/types';

export function useProjects(status?: 'active' | 'inactive') {
  const { projects, isLoaded } = useAppData() as {
    projects: Project[];
    isLoaded: boolean;
  };
  const filtered = status ? projects.filter(p => p.status === status) : projects;
  return { projects: filtered, loading: !isLoaded, error: null };
}
