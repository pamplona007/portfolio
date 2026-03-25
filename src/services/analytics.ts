import { supabase } from './supabase';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Track a page view. Debounced to avoid duplicate rapid calls.
 */
export function trackPageView(path: string): void {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    try {
      await supabase.from('page_views').insert([{ path }]);
    } catch (error) {
      // Silently fail — analytics should never break the app
      console.error('Failed to track page view:', error);
    }
  }, 500);
}

/**
 * Get page view stats for the dashboard
 */
export async function getPageViewStats(days: number = 7): Promise<{ date: string; count: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('page_views')
    .select('visitedAt')
    .gte('visitedAt', startDate.toISOString());

  if (error) throw error;

  // Group by day
  const counts: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    counts[d.toISOString().split('T')[0]] = 0;
  }

  for (const view of data ?? []) {
    const day = view.visitedAt.split('T')[0];
    if (counts[day] !== undefined) counts[day]++;
  }

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get total page views
 */
export async function getTotalPageViews(): Promise<number> {
  const { count, error } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count ?? 0;
}
