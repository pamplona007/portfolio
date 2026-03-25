import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Modal } from '@/components/admin/Modal';
import { CrudForm } from '@/components/admin/CrudForm';
import { z } from 'zod';
import type { Profile, Experience, Education } from '@/types';
import styles from './styles.module.css';

const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().nullish(),
  bio: z.string().nullish(),
  socialGithub: z.string().url().nullish().or(z.literal('')),
  socialLinkedin: z.string().url().nullish().or(z.literal('')),
  socialEmail: z.string().email().nullish().or(z.literal('')),
});

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
});

const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileRes, expRes, eduRes] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('experience').select('*').order('sort_order'),
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

  const handleProfileSave = async (data: z.infer<typeof profileSchema>) => {
    if (!profile) return;
    await supabase.from('profile').update(data).eq('id', profile.id);
    setProfile({ ...profile, ...data });
    setProfileModalOpen(false);
  };

  const handleExpSave = async (data: z.infer<typeof experienceSchema>) => {
    if (editingExp) {
      await supabase.from('experience').update(data).eq('id', editingExp.id);
      setExperiences(experiences.map(e => e.id === editingExp.id ? { ...e, ...data } : e));
    } else {
      const { data: newExp } = await supabase.from('experience').insert([data]).select().single();
      if (newExp) setExperiences([...experiences, newExp]);
    }
    setExpModalOpen(false);
    setEditingExp(null);
  };

  const handleEduSave = async (data: z.infer<typeof educationSchema>) => {
    if (editingEdu) {
      await supabase.from('education').update(data).eq('id', editingEdu.id);
      setEducation(education.map(e => e.id === editingEdu.id ? { ...e, ...data } : e));
    } else {
      const { data: newEdu } = await supabase.from('education').insert([data]).select().single();
      if (newEdu) setEducation([...education, newEdu]);
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
          <button className={styles.editBtn} onClick={() => setProfileModalOpen(true)}>
            <Pencil size={14} /> Edit
          </button>
        </div>
        {profile && (
          <div className={styles.profileCard}>
            <h3 className={styles.profileName}>{profile.name}</h3>
            <p className={styles.profileTitle}>{profile.title}</p>
            {profile.tagline && <p className={styles.profileTagline}>{profile.tagline}</p>}
            {profile.bio && <p className={styles.profileBio}>{profile.bio}</p>}
          </div>
        )}
      </section>

      {/* Experience */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <button className={styles.addBtn} onClick={() => { setEditingExp(null); setExpModalOpen(true); }}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div className={styles.itemList}>
          {experiences.map(exp => (
            <div key={exp.id} className={styles.item}>
              <div className={styles.itemContent}>
                <strong>{exp.role}</strong> — {exp.company}
                <span className={styles.itemPeriod}>
                  {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.iconBtn} onClick={() => { setEditingExp(exp); setExpModalOpen(true); }}>
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
          <button className={styles.addBtn} onClick={() => { setEditingEdu(null); setEduModalOpen(true); }}>
            <Plus size={14} /> Add
          </button>
        </div>
        <div className={styles.itemList}>
          {education.map(edu => (
            <div key={edu.id} className={styles.item}>
              <div className={styles.itemContent}>
                <strong>{edu.degree}</strong> — {edu.school}
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
        {profile && (
          <CrudForm
            schema={profileSchema}
            defaultValues={profile}
            fields={[
              { name: 'name', label: 'Name' },
              { name: 'title', label: 'Title' },
              { name: 'tagline', label: 'Tagline', type: 'text' },
              { name: 'bio', label: 'Bio', type: 'textarea', rows: 5 },
              { name: 'socialGithub', label: 'GitHub URL', type: 'url' },
              { name: 'socialLinkedin', label: 'LinkedIn URL', type: 'url' },
              { name: 'socialEmail', label: 'Email', type: 'email' },
            ]}
            onSubmit={handleProfileSave}
            onCancel={() => setProfileModalOpen(false)}
          />
        )}
      </Modal>

      {/* Experience Modal */}
      <Modal
        open={expModalOpen}
        onOpenChange={(v) => { setExpModalOpen(v); if (!v) setEditingExp(null); }}
        title={editingExp ? 'Edit Experience' : 'Add Experience'}
      >
        <CrudForm
          schema={experienceSchema}
          defaultValues={editingExp ? {
            ...editingExp,
            startDate: editingExp.startDate.split('T')[0],
            endDate: editingExp.endDate?.split('T')[0] ?? '',
            description: editingExp.description ?? '',
          } : {
            company: '', role: '', startDate: '', endDate: '', current: false, description: ''
          }}
          fields={[
            { name: 'company', label: 'Company' },
            { name: 'role', label: 'Role' },
            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2022-01' },
            { name: 'endDate', label: 'End Date (leave empty if current)', type: 'text', placeholder: '2024-12' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
          ]}
          onSubmit={handleExpSave}
          onCancel={() => { setExpModalOpen(false); setEditingExp(null); }}
        />
      </Modal>

      {/* Education Modal */}
      <Modal
        open={eduModalOpen}
        onOpenChange={(v) => { setEduModalOpen(v); if (!v) setEditingEdu(null); }}
        title={editingEdu ? 'Edit Education' : 'Add Education'}
      >
        <CrudForm
          schema={educationSchema}
          defaultValues={editingEdu ? {
            ...editingEdu,
            startDate: editingEdu.startDate.split('T')[0],
            endDate: editingEdu.endDate?.split('T')[0] ?? '',
          } : {
            school: '', degree: '', field: '', startDate: '', endDate: ''
          }}
          fields={[
            { name: 'school', label: 'School' },
            { name: 'degree', label: 'Degree' },
            { name: 'field', label: 'Field of Study' },
            { name: 'startDate', label: 'Start Date', type: 'text', placeholder: '2012' },
            { name: 'endDate', label: 'End Date', type: 'text', placeholder: '2016' },
          ]}
          onSubmit={handleEduSave}
          onCancel={() => { setEduModalOpen(false); setEditingEdu(null); }}
        />
      </Modal>
    </div>
  );
}
