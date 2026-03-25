import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Project } from '@/types';

export function useProjects(status?: 'active' | 'inactive') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        let query = supabase.from('projects').select('*').order('sortOrder');
        if (status) query = query.eq('status', status);
        const { data, error: err } = await query;
        if (err) setError(err.message);
        else setProjects(data ?? []);
      } catch (e) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [status]);

  return { projects, loading, error };
}
