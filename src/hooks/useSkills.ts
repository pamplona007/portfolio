import { useState, useEffect } from 'react';
import type { Skill } from '@/types';
import skillsData from '@/data/skills.json';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setSkills(skillsData as unknown as Skill[]);
    } catch {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, []);

  return { skills, loading, error };
}
