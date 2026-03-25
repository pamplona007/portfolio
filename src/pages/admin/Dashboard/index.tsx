import { useEffect, useState } from 'react';
import { Eye, Mail, FolderOpen } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable } from '@/components/admin/DataTable';
import { supabase } from '@/services/supabase';
import type { ContactSubmission } from '@/types';
import styles from './styles.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalViews: 0,
    contactCount: 0,
    projectCount: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [viewsRes, contactRes, projectRes, submissionsRes] = await Promise.all([
          supabase.from('page_views').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase
            .from('contact_submissions')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalViews: viewsRes.count ?? 0,
          contactCount: contactRes.count ?? 0,
          projectCount: projectRes.count ?? 0,
        });
        setRecentSubmissions(submissionsRes.data ?? []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const submissionColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: ContactSubmission) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (row: ContactSubmission) => (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          {row.message.length > 60 ? row.message.slice(0, 60) + '…' : row.message}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row: ContactSubmission) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'read',
      header: 'Status',
      render: (row: ContactSubmission) => (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '9999px',
            background: row.read ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 107, 53, 0.1)',
            color: row.read ? '#4ade80' : 'var(--color-primary-container)',
          }}
        >
          {row.read ? 'Read' : 'New'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Overview</h1>
        <p className={styles.subheading}>Your portfolio at a glance</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatsCard
          label="Total Page Views"
          value={stats.totalViews.toLocaleString()}
          icon={<Eye size={18} />}
        />
        <StatsCard
          label="Contact Submissions"
          value={stats.contactCount}
          icon={<Mail size={18} />}
        />
        <StatsCard
          label="Projects"
          value={stats.projectCount}
          icon={<FolderOpen size={18} />}
        />
      </div>

      {/* Recent submissions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Messages</h2>
        <DataTable
          columns={submissionColumns}
          data={recentSubmissions}
          keyField="id"
          loading={loading}
          emptyMessage="No messages yet"
        />
      </section>
    </div>
  );
}
