import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Profile, Experience, Education, Skill } from '@/types';

export function useAboutData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, expRes, eduRes, skillRes] = await Promise.all([
          supabase.from('profile').select('*').single(),
          supabase.from('experience').select('*').order('sortOrder'),
          supabase.from('education').select('*'),
          supabase.from('skills').select('*'),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (profileRes.data) setProfile(profileRes.data);
        if (expRes.data) setExperiences(expRes.data);
        if (eduRes.data) setEducation(eduRes.data);
        if (skillRes.data) setSkills(skillRes.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load data';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { profile, experiences, education, skills, loading, error };
}
