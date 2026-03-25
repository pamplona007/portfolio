import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Skill } from '@/types';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error: err } = await supabase.from('skills').select('*');
        if (err) setError(err.message);
        else setSkills(data ?? []);
      } catch {
        setError('Failed to load skills');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { skills, loading, error };
}
