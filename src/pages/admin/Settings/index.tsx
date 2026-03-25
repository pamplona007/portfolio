import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { TabbedTranslatableForm } from '@/components/admin/TabbedTranslatableForm';
import { z } from 'zod';
import type { Profile } from '@/types';
import styles from './styles.module.css';

const localizedString = z.object({
  en: z.string(),
  pt: z.string(),
});

const settingsSchema = z.object({
  name: localizedString,
  title: localizedString,
  tagline: localizedString.nullish(),
  bio: localizedString.nullish(),
  socialGithub: z.string().url().nullish().or(z.literal('')),
  socialLinkedin: z.string().url().nullish().or(z.literal('')),
  socialEmail: z.string().email().nullish().or(z.literal('')),
  metaDescription: localizedString.nullish(),
});

type Language = 'en' | 'pt';

export default function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [localizedData, setLocalizedData] = useState<Record<string, Record<string, unknown>>>({});

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setLocalizedData({
          name: data.name as Record<string, string>,
          title: data.title as Record<string, string>,
          tagline: data.tagline as Record<string, string> ?? { en: '', pt: '' },
          bio: data.bio as Record<string, string> ?? { en: '', pt: '' },
          metaDescription: data.metaDescription as Record<string, string> ?? { en: '', pt: '' },
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (_data: Record<string, unknown>, _lang: Language) => {
    if (!profile) return;
    const payload = {
      name: localizedData['name'] as Record<string, string>,
      title: localizedData['title'] as Record<string, string>,
      tagline: localizedData['tagline'] as Record<string, string> | null,
      bio: localizedData['bio'] as Record<string, string> | null,
      metaDescription: localizedData['metaDescription'] as Record<string, string> | null,
    };
    await supabase.from('profile').update(payload).eq('id', profile.id);
    setProfile({ ...profile, ...payload });
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
          <TabbedTranslatableForm
            schema={settingsSchema}
            defaultValues={localizedData['en'] ?? { name: { en: '', pt: '' }, title: { en: '', pt: '' }, tagline: { en: '', pt: '' }, bio: { en: '', pt: '' }, metaDescription: { en: '', pt: '' } }}
            fields={[
              { name: 'name', label: 'Display Name' },
              { name: 'title', label: 'Professional Title' },
              { name: 'tagline', label: 'Tagline', type: 'text' },
              { name: 'bio', label: 'Bio', type: 'textarea', rows: 5 },
              { name: 'metaDescription', label: 'Meta Description (for SEO)', type: 'textarea', rows: 2 },
            ]}
            localizedData={localizedData}
            onLocalizedDataChange={setLocalizedData}
            onSubmit={handleSave}
            submitLabel={saved ? '✓ Saved!' : 'Save Changes'}
            onCancel={undefined}
          >
            {null}
          </TabbedTranslatableForm>
          <div className={styles.socialSection}>
            <h3 className={styles.sectionTitle}>Social Links</h3>
            <div className={styles.socialFields}>
              <div className={styles.field}>
                <label className={styles.label}>GitHub URL</label>
                <input
                  type="url"
                  className={styles.input}
                  value={profile.socialGithub ?? ''}
                  onChange={async (e) => {
                    const val = e.target.value;
                    await supabase.from('profile').update({ socialGithub: val }).eq('id', profile.id);
                    setProfile({ ...profile, socialGithub: val });
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>LinkedIn URL</label>
                <input
                  type="url"
                  className={styles.input}
                  value={profile.socialLinkedin ?? ''}
                  onChange={async (e) => {
                    const val = e.target.value;
                    await supabase.from('profile').update({ socialLinkedin: val }).eq('id', profile.id);
                    setProfile({ ...profile, socialLinkedin: val });
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={profile.socialEmail ?? ''}
                  onChange={async (e) => {
                    const val = e.target.value;
                    await supabase.from('profile').update({ socialEmail: val }).eq('id', profile.id);
                    setProfile({ ...profile, socialEmail: val });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
