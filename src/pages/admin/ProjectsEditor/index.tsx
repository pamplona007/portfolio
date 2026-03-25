import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { Modal } from '@/components/admin/Modal';
import { CrudForm } from '@/components/admin/CrudForm';
import { z } from 'zod';
import type { Project } from '@/types';
import styles from './styles.module.css';

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  techStack: z.string(), // comma-separated, converted to array
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  screenshots: z.string(), // JSON string for now
  status: z.enum(['active', 'inactive']),
});

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order');
      if (data) setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (formData: z.infer<typeof projectSchema>) => {
    const data = {
      ...formData,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      screenshots: [],
    };

    if (editingProject) {
      await supabase.from('projects').update(data).eq('id', editingProject.id);
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...data } : p));
    } else {
      const { data: newProject } = await supabase
        .from('projects')
        .insert([{ ...data, sort_order: projects.length }])
        .select()
        .single();
      if (newProject) setProjects([...projects, newProject]);
    }
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const openCreate = () => { setEditingProject(null); setModalOpen(true); };
  const openEdit = (project: Project) => { setEditingProject(project); setModalOpen(true); };

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
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <span className={`${styles.statusBadge} ${styles[project.status]}`}>
                    {project.status}
                  </span>
                </div>
                <p className={styles.projectDesc}>{project.description}</p>
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
        <CrudForm
          schema={projectSchema}
          defaultValues={editingProject ? {
            ...editingProject,
            techStack: editingProject.techStack.join(', '),
            screenshots: '',
            liveUrl: editingProject.liveUrl ?? '',
            repoUrl: editingProject.repoUrl ?? '',
          } : {
            title: '', slug: '', description: '', techStack: '', liveUrl: '', repoUrl: '', screenshots: '', status: 'active' as const
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
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditingProject(null); }}
        />
      </Modal>
    </div>
  );
}
