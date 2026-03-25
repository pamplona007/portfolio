import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Modal } from '@/components/admin/Modal';
import { TabbedTranslatableForm } from '@/components/admin/TabbedTranslatableForm';
import { z } from 'zod';
import type { Profile, Experience, Education, LocalizedString } from '@/types';
import styles from './styles.module.css';

const localizedString = z.object({
  en: z.string(),
  pt: z.string(),
});

const profileSchema = z.object({
  name: localizedString,
  title: localizedString,
  tagline: localizedString.nullish(),
  bio: localizedString.nullish(),
  socialGithub: z.string().url().nullish().or(z.literal('')),
  socialLinkedin: z.string().url().nullish().or(z.literal('')),
  socialEmail: z.string().email().nullish().or(z.literal('')),
});

const experienceSchema = z.object({
  company: localizedString,
  role: localizedString,
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: localizedString.nullish(),
});

const educationSchema = z.object({
  school: localizedString,
  degree: localizedString,
  field: localizedString,
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});

type Language = 'en' | 'pt';

const emptyLocalizedString = { en: '', pt: '' };

export default function AboutEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [profileLocalizedData, setProfileLocalizedData] = useState<Record<string, Record<string, unknown>>>({});
  const [expLocalizedData, setExpLocalizedData] = useState<Record<string, Record<string, unknown>>>({});
  const [eduLocalizedData, setEduLocalizedData] = useState<Record<string, Record<string, unknown>>>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileRes, expRes, eduRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('experience').select('*').order('sortOrder'),
        supabase.from('education').select('*'),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (eduRes.data) setEducation(eduRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileSave = async (_data: Record<string, unknown>, _lang: Language) => {
    if (!profile) return;
    const payload = {
      name: profileLocalizedData['name'] as Record<string, string>,
      title: profileLocalizedData['title'] as Record<string, string>,
      tagline: profileLocalizedData['tagline'] as Record<string, string> | null,
      bio: profileLocalizedData['bio'] as Record<string, string> | null,
    };
    await supabase.from('profile').update(payload).eq('id', profile.id);
    setProfile({ ...profile, ...payload });
    setProfileModalOpen(false);
  };

  const handleExpSave = async (_data: Record<string, unknown>, _lang: Language) => {
    const payload = {
      company: expLocalizedData['company'] as Record<string, string>,
      role: expLocalizedData['role'] as Record<string, string>,
      description: expLocalizedData['description'] as Record<string, string> | null,
      startDate: (_data.startDate as string) || '',
      endDate: (_data.endDate as string) || undefined,
      current: (_data.current as boolean) || false,
    };
    if (editingExp) {
      await supabase.from('experience').update(payload).eq('id', editingExp.id);
      setExperiences(experiences.map(e => e.id === editingExp.id
        ? { ...e, company: payload.company as LocalizedString, role: payload.role as LocalizedString, description: payload.description as LocalizedString | null, startDate: payload.startDate, endDate: payload.endDate, current: payload.current }
        : e
      ) as Experience[]);
    } else {
      const { data: newExp } = await supabase.from('experience').insert([payload]).select().single();
      if (newExp) setExperiences([...experiences, newExp as Experience]);
    }
    setExpModalOpen(false);
    setEditingExp(null);
  };

  const handleEduSave = async (_data: Record<string, unknown>, _lang: Language) => {
    const payload = {
      school: eduLocalizedData['school'] as Record<string, string>,
      degree: eduLocalizedData['degree'] as Record<string, string>,
      field: eduLocalizedData['field'] as Record<string, string>,
      startDate: (_data.startDate as string) || '',
      endDate: (_data.endDate as string) || undefined,
    };
    if (editingEdu) {
      await supabase.from('education').update(payload).eq('id', editingEdu.id);
      setEducation(education.map(e => e.id === editingEdu.id
        ? { ...e, school: payload.school as LocalizedString, degree: payload.degree as LocalizedString, field: payload.field as LocalizedString, startDate: payload.startDate, endDate: payload.endDate }
        : e
      ) as Education[]);
    } else {
      const { data: newEdu } = await supabase.from('education').insert([payload]).select().single();
      if (newEdu) setEducation([...education, newEdu as Education]);
    }
    setEduModalOpen(false);
    setEditingEdu(null);
  };

  const handleDeleteExp = async (id: string) => {
    await supabase.from('experience').delete().eq('id', id);
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleDeleteEdu = async (id: string) => {
    await supabase.from('education').delete().eq('id', id);
    setEducation(education.filter(e => e.id !== id));
  };

  const openProfileEdit = () => {
    if (!profile) return;
    setProfileLocalizedData({
      name: profile.name as Record<string, string>,
      title: profile.title as Record<string, string>,
      tagline: (profile.tagline as Record<string, string>) ?? { en: '', pt: '' },
      bio: (profile.bio as Record<string, string>) ?? { en: '', pt: '' },
    });
    setProfileModalOpen(true);
  };

  const openExpCreate = () => {
    setEditingExp(null);
    setExpLocalizedData({
      company: { en: '', pt: '' },
      role: { en: '', pt: '' },
      description: { en: '', pt: '' },
    });
    setExpModalOpen(true);
  };

  const openExpEdit = (exp: Experience) => {
    setEditingExp(exp);
    setExpLocalizedData({
      company: (exp.company as Record<string, string>) ?? { en: '', pt: '' },
      role: (exp.role as Record<string, string>) ?? { en: '', pt: '' },
      description: (exp.description as Record<string, string>) ?? { en: '', pt: '' },
    });
    setExpModalOpen(true);
  };

  const openEduCreate = () => {
    setEditingEdu(null);
    setEduLocalizedData({
      school: { en: '', pt: '' },
      degree: { en: '', pt: '' },
      field: { en: '', pt: '' },
    });
    setEduModalOpen(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>About</h1>
      </div>

      {/* Profile */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <button className={styles.editBtn} onClick={openProfileEdit}>
            <Pencil size={14} /> Edit
          </button>
        </div>
        {profile && (
          <div className={styles.profileCard}>
            <h3 className={styles.profileName}>{(profile.name as Record<string, string>).en}</h3>
            <p className={styles.profileTitle}>{(profile.title as Record<string, string>).en}</p>
            {profile.tagline && <p className={styles.profileTagline}>{(profile.tagline as Record<string, string>).en}</p>}
            {profile.bio && <p className={styles.profileBio}>{(profile.bio as Record<string, string>).en}</p>}
          </div>
        )}
      </section>

      {/* Experience */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <button className={styles.addBtn} onClick={openExpCreate}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div className={styles.itemList}>
          {experiences.map(exp => (
            <div key={exp.id} className={styles.item}>
              <div className={styles.itemContent}>
                <strong>{(exp.role as Record<string, string>).en}</strong> — {(exp.company as Record<string, string>).en}
                <span className={styles.itemPeriod}>
                  {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.iconBtn} onClick={() => openExpEdit(exp)}>
                  <Pencil size={14} />
                </button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDeleteExp(exp.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <button className={styles.addBtn} onClick={openEduCreate}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div className={styles.itemList}>
          {education.map(edu => (
            <div key={edu.id} className={styles.item}>
              <div className={styles.itemContent}>
                <strong>{(edu.degree as Record<string, string>).en}</strong> — {(edu.school as Record<string, string>).en}
                <span className={styles.itemPeriod}>
                  {new Date(edu.startDate).getFullYear()} — {edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDeleteEdu(edu.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profile Modal */}
      <Modal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        title="Edit Profile"
      >
        <TabbedTranslatableForm
          schema={profileSchema}
          defaultValues={profileLocalizedData['en'] ?? { name: emptyLocalizedString, title: emptyLocalizedString, tagline: emptyLocalizedString, bio: emptyLocalizedString }}
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'title', label: 'Title' },
            { name: 'tagline', label: 'Tagline', type: 'text' },
            { name: 'bio', label: 'Bio', type: 'textarea', rows: 5 },
          ]}
          localizedData={profileLocalizedData}
          onLocalizedDataChange={setProfileLocalizedData}
          onSubmit={handleProfileSave}
          onCancel={() => setProfileModalOpen(false)}
          submitLabel="Save"
        >
          {null}
        </TabbedTranslatableForm>
      </Modal>

      {/* Experience Modal */}
      <Modal
        open={expModalOpen}
        onOpenChange={(v) => { setExpModalOpen(v); if (!v) setEditingExp(null); }}
        title={editingExp ? 'Edit Experience' : 'Add Experience'}
      >
        <TabbedTranslatableForm
          schema={experienceSchema}
          defaultValues={editingExp ? {
            ...editingExp,
            startDate: editingExp.startDate.split('T')[0],
            endDate: editingExp.endDate?.split('T')[0] ?? '',
          } : {
            company: emptyLocalizedString, role: emptyLocalizedString, startDate: '', endDate: '', current: false, description: emptyLocalizedString
          }}
          fields={[
            { name: 'company', label: 'Company' },
            { name: 'role', label: 'Role' },
            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2022-01' },
            { name: 'endDate', label: 'End Date (leave empty if current)', type: 'text', placeholder: '2024-12' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
          ]}
          localizedData={expLocalizedData}
          onLocalizedDataChange={setExpLocalizedData}
          onSubmit={handleExpSave}
          onCancel={() => { setExpModalOpen(false); setEditingExp(null); }}
          submitLabel="Save"
        >
          {null}
        </TabbedTranslatableForm>
      </Modal>

      {/* Education Modal */}
      <Modal
        open={eduModalOpen}
        onOpenChange={(v) => { setEduModalOpen(v); if (!v) setEditingEdu(null); }}
        title={editingEdu ? 'Edit Education' : 'Add Education'}
      >
        <TabbedTranslatableForm
          schema={educationSchema}
          defaultValues={editingEdu ? {
            ...editingEdu,
            startDate: editingEdu.startDate.split('T')[0],
            endDate: editingEdu.endDate?.split('T')[0] ?? '',
          } : {
            school: emptyLocalizedString, degree: emptyLocalizedString, field: emptyLocalizedString, startDate: '', endDate: ''
          }}
          fields={[
            { name: 'school', label: 'School' },
            { name: 'degree', label: 'Degree' },
            { name: 'field', label: 'Field of Study' },
            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2012' },
            { name: 'endDate', label: 'End Date', type: 'text', placeholder: '2016' },
          ]}
          localizedData={eduLocalizedData}
          onLocalizedDataChange={setEduLocalizedData}
          onSubmit={handleEduSave}
          onCancel={() => { setEduModalOpen(false); setEditingEdu(null); }}
          submitLabel="Save"
        >
          {null}
        </TabbedTranslatableForm>
      </Modal>
    </div>
  );
}
