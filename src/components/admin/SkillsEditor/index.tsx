import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Modal } from '@/components/admin/Modal';
import { TabbedTranslatableForm } from '@/components/admin/TabbedTranslatableForm';
import { z } from 'zod';
import type { Skill } from '@/types';
import styles from './styles.module.css';

const localizedString = z.object({
  en: z.string(),
  pt: z.string(),
});

const skillSchema = z.object({
  name: localizedString,
  category: z.enum(['frontend', 'backend', 'devops', 'tools']),
});

export function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [localizedData, setLocalizedData] = useState<Record<string, Record<string, unknown>>>({});

  useEffect(() => { loadSkills(); }, []);

  async function loadSkills() {
    const { data } = await supabase.from('skills').select('*');
    if (data) setSkills(data);
    setLoading(false);
  }

  const handleSave = async (_data: Record<string, unknown>, _lang: string) => {
    if (editingSkill) {
      await supabase.from('skills').update(localizedData).eq('id', editingSkill.id);
      setSkills(skills.map(s => s.id === editingSkill.id ? { ...s, ...localizedData } : s));
    } else {
      const { data: newSkill } = await supabase.from('skills').insert([localizedData]).select().single();
      if (newSkill) setSkills([...skills, newSkill]);
    }
    setModalOpen(false);
    setEditingSkill(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id);
    setSkills(skills.filter(s => s.id !== id));
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setLocalizedData({ name: skill.name });
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingSkill(null);
    setLocalizedData({ name: { en: '', pt: '' } });
    setModalOpen(true);
  };

  const categories = ['frontend', 'backend', 'devops', 'tools'] as const;

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Skills</h1>
          <p className={styles.subheading}>{skills.length} total</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <Plus size={16} /> New Skill
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map(cat => (
          <div key={cat} className={styles.categoryGroup}>
            <h2 className={styles.categoryTitle}>{cat}</h2>
            <div className={styles.skillList}>
              {skills.filter(s => s.category === cat).map(skill => (
                <div key={skill.id} className={styles.skillItem}>
                  <span className={styles.skillName}>
                    {skill.name.en || skill.name.pt}
                  </span>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => openEdit(skill)}>
                      <Pencil size={14} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(skill.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditingSkill(null); }}
        title={editingSkill ? 'Edit Skill' : 'New Skill'}
      >
        <TabbedTranslatableForm
          schema={skillSchema}
          defaultValues={editingSkill ? editingSkill.name : { en: '', pt: '' }}
          fields={[
            { name: 'name', label: 'Skill Name' },
          ]}
          localizedData={localizedData}
          onLocalizedDataChange={setLocalizedData}
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditingSkill(null); }}
        />
      </Modal>
    </div>
  );
}
