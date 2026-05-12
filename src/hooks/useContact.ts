import { useState } from 'react';

interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export function useContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitContact(_data: ContactInput) {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // No-op: contact form submissions are no longer stored
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
