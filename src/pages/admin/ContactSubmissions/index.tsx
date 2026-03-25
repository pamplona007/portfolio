import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { DataTable } from '@/components/admin/DataTable';
import type { ContactSubmission } from '@/types';
import styles from './styles.module.css';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('createdAt', { ascending: false });
      if (data) setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const markAsRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    setSubmissions(submissions.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const markAllRead = async () => {
    await supabase.from('contact_submissions').update({ read: true }).eq('read', false);
    setSubmissions(submissions.map(s => ({ ...s, read: true })));
  };

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Message', 'Date', 'Status'],
      ...submissions.map(s => [s.name, s.email, `"${s.message.replace(/"/g, '""')}"`, new Date(s.createdAt).toISOString(), s.read ? 'Read' : 'New']),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unreadCount = submissions.filter(s => !s.read).length;

  const columns = [
    {
      key: 'name',
      header: 'Contact',
      render: (row: ContactSubmission) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (row: ContactSubmission) => (
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 400 }}>
          {row.message}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row: ContactSubmission) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
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
            cursor: row.read ? 'default' : 'pointer',
          }}
          onClick={() => { if (!row.read) markAsRead(row.id); }}
        >
          {row.read ? 'Read' : 'New — click to mark'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Contact Messages</h1>
          <p className={styles.subheading}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className={styles.actions}>
          {unreadCount > 0 && (
            <button className={styles.secondaryBtn} onClick={markAllRead}>
              Mark All Read
            </button>
          )}
          <button className={styles.exportBtn} onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={submissions}
        keyField="id"
        loading={loading}
        emptyMessage="No messages yet"
      />
    </div>
  );
}
