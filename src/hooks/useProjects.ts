import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Project } from '@/types';

export function useProjects(status?: 'active' | 'inactive') {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase.from('projects').select('*').order('sort_order');
    if (status) query = query.eq('status', status);

    query.then(({ data, error }) => {
      if (error) setError(error.message);
      else setProjects(data ?? []);
      setLoading(false);
    });
  }, [status]);

  return { projects, loading, error };
}
