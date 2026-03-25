import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { Profile } from '@/types';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProfile(data);
        setLoading(false);
      });
  }, []);

  return { profile, loading, error };
}
