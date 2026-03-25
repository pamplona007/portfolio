import { useState } from 'react';
import { supabase } from '@/services/supabase';

interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitContact(data: ContactInput) {
    setLoading(true);
    setError(null);
    try {
      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([data]);
      if (submitError) throw submitError;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { submitContact, loading, error };
}
