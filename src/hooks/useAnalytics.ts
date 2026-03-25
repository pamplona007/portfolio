import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

export function useAnalytics(days: number = 7) {
  const [totalViews, setTotalViews] = useState(0);
  const [viewsByDay, setViewsByDay] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const [totalRes, viewsRes] = await Promise.all([
          supabase.from('page_views').select('*', { count: 'exact', head: true }),
          supabase
            .from('page_views')
            .select('visitedAt')
            .gte('visitedAt', startDate.toISOString()),
        ]);

        setTotalViews(totalRes.count ?? 0);

        const counts: Record<string, number> = {};
        for (let i = 0; i < days; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          counts[d.toISOString().split('T')[0]] = 0;
        }
        for (const view of viewsRes.data ?? []) {
          const day = view.visitedAt.split('T')[0];
          if (counts[day] !== undefined) counts[day]++;
        }
        setViewsByDay(
          Object.entries(counts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
        );
      } catch (err) {
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [days]);

  return { totalViews, viewsByDay, loading };
}
