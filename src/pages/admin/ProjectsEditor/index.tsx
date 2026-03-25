import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Modal } from '@/components/admin/Modal';
import { TabbedTranslatableForm } from '@/components/admin/TabbedTranslatableForm';
import { z } from 'zod';
import type { Project, LocalizedString } from '@/types';
import styles from './styles.module.css';

const localizedString = z.object({
  en: z.string(),
  pt: z.string(),
});

const projectSchema = z.object({
  title: localizedString,
  slug: z.string().min(1),
  description: localizedString,
  techStack: z.string(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  screenshots: z.string(),
  status: z.enum(['active', 'inactive']),
});

type Language = 'en' | 'pt';

const emptyLocalizedString = { en: '', pt: '' };

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [localizedData, setLocalizedData] = useState<Record<string, Record<string, unknown>>>({});

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('sortOrder');
      if (data) setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (formData: Record<string, unknown>, _lang: Language) => {
    const payload = {
      title: localizedData['title'] as Record<string, string>,
      description: localizedData['description'] as Record<string, string>,
      slug: formData.slug as string,
      techStack: (formData.techStack as string).split(',').map((s: string) => s.trim()).filter(Boolean),
      liveUrl: (formData.liveUrl as string) || '',
      repoUrl: (formData.repoUrl as string) || '',
      screenshots: '',
      status: formData.status as 'active' | 'inactive',
    };

    if (editingProject) {
      await supabase.from('projects').update(payload).eq('id', editingProject.id);
      setProjects(projects.map(p => p.id === editingProject.id
        ? { ...p, title: payload.title as LocalizedString, description: payload.description as LocalizedString, slug: payload.slug, techStack: payload.techStack, liveUrl: payload.liveUrl, repoUrl: payload.repoUrl, screenshots: payload.screenshots, status: payload.status }
        : p
      ) as Project[]);
    } else {
      const { data: newProject } = await supabase
        .from('projects')
        .insert([{ ...payload, sortOrder: projects.length }])
        .select()
        .single();
      if (newProject) setProjects([...projects, newProject as Project]);
    }
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const openCreate = () => {
    setEditingProject(null);
    setLocalizedData({
      title: { en: '', pt: '' },
      description: { en: '', pt: '' },
    });
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setLocalizedData({
      title: (project.title as Record<string, string>) ?? { en: '', pt: '' },
      description: (project.description as Record<string, string>) ?? { en: '', pt: '' },
    });
    setModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Projects</h1>
          <p className={styles.subheading}>{projects.length} total</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className={styles.projectList}>
          {projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectInfo}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{(project.title as Record<string, string>).en}</h3>
                  <span className={`${styles.statusBadge} ${styles[project.status]}`}>
                    {project.status}
                  </span>
                </div>
                <p className={styles.projectDesc}>{(project.description as Record<string, string>).en}</p>
                <div className={styles.techStack}>
                  {project.techStack.map(tech => (
                    <span key={tech} className={styles.tech}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className={styles.projectActions}>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                    <ExternalLink size={15} />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                    <Github size={15} />
                  </a>
                )}
                <button className={styles.iconBtn} onClick={() => openEdit(project)}>
                  <Pencil size={14} />
                </button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(project.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditingProject(null); }}
        title={editingProject ? 'Edit Project' : 'New Project'}
        size="lg"
      >
        <TabbedTranslatableForm
          schema={projectSchema}
          defaultValues={editingProject ? {
            ...editingProject,
            techStack: editingProject.techStack.join(', '),
            screenshots: '',
            liveUrl: editingProject.liveUrl ?? '',
            repoUrl: editingProject.repoUrl ?? '',
          } : {
            title: emptyLocalizedString, slug: '', description: emptyLocalizedString, techStack: '', liveUrl: '', repoUrl: '', screenshots: '', status: 'active' as const
          }}
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'slug', label: 'Slug (URL friendly)' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
            { name: 'techStack', label: 'Tech Stack (comma-separated)', placeholder: 'React, TypeScript, Node.js' },
            { name: 'liveUrl', label: 'Live URL', type: 'url' },
            { name: 'repoUrl', label: 'Repository URL', type: 'url' },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ],
            },
          ]}
          localizedData={localizedData}
          onLocalizedDataChange={setLocalizedData}
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditingProject(null); }}
          submitLabel="Save"
        >
          {null}
        </TabbedTranslatableForm>
      </Modal>
    </div>
  );
}
