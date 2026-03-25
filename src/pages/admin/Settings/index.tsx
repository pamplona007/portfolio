import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { CrudForm } from '@/components/admin/CrudForm';
import { z } from 'zod';
import type { Profile } from '@/types';
import styles from './styles.module.css';

const settingsSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().nullish(),
  bio: z.string().nullish(),
  socialGithub: z.string().url().nullish().or(z.literal('')),
  socialLinkedin: z.string().url().nullish().or(z.literal('')),
  socialEmail: z.string().email().nullish().or(z.literal('')),
  metaDescription: z.string().nullish(),
});

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (data: z.infer<typeof settingsSchema>) => {
    if (!profile) return;
    await supabase.from('profile').update(data).eq('id', profile.id);
    setProfile({ ...profile, ...data });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Settings</h1>
        <p className={styles.subheading}>Manage your public profile information</p>
      </div>

      {profile && (
        <div className={styles.formSection}>
          <CrudForm
            schema={settingsSchema}
            defaultValues={profile}
            fields={[
              { name: 'name', label: 'Display Name' },
              { name: 'title', label: 'Professional Title' },
              { name: 'tagline', label: 'Tagline', type: 'text' },
              { name: 'bio', label: 'Bio', type: 'textarea', rows: 5 },
              { name: 'socialGithub', label: 'GitHub URL', type: 'url' },
              { name: 'socialLinkedin', label: 'LinkedIn URL', type: 'url' },
              { name: 'socialEmail', label: 'Email', type: 'email' },
              { name: 'metaDescription', label: 'Meta Description (for SEO)', type: 'textarea', rows: 2 },
            ]}
            onSubmit={handleSave}
            submitLabel={saved ? '✓ Saved!' : 'Save Changes'}
          />
        </div>
      )}
    </div>
  );
}
