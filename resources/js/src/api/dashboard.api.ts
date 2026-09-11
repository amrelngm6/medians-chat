import client from './client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DashboardFormMessageCounts {
  new: number;
  read: number;
  replied: number;
  archived: number;
  spam: number;
}

export interface DashboardFormMessageStats {
  total: number;
  unread: number;
  counts: DashboardFormMessageCounts;
}

export interface PopularUserMessage {
  message: string;
  count: number;
  percentage: number;
  last_used_at: string | null;
}

export interface DashboardUserMessageStats {
  total: number;
  this_week: number;
  popular: PopularUserMessage[];
}

export interface DashboardContentSectionStats {
  total: number;
  last_updated: string | null;
}

export interface DashboardWeeklyActivity {
  label: string;   // 'Mon', 'Tue', …
  date: string;    // 'YYYY-MM-DD'
  form_messages: number;
  user_messages: number;
}

export interface DashboardStats {
  form_messages: DashboardFormMessageStats;
  user_messages: DashboardUserMessageStats;
  content_sections: DashboardContentSectionStats;
  weekly_activity: DashboardWeeklyActivity[];
}

// ── API ────────────────────────────────────────────────────────────────────

export const dashboardApi = {
  /**
   * GET /api/v1/dashboard/stats
   *
   * Returns aggregated stats for the admin dashboard.
   */
  stats: () =>
    client.get<{ success: true; data: DashboardStats }>('/dashboard/stats'),
};
