import client from './client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface UserMessage {
  id: string;
  message: string;
  ip: string | null;
  browser: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PopularUserMessage {
  message: string;
  count: number;
  percentage: number;
  last_used_at: string | null;
}

export interface UserMessageListMeta {
  page: number;
  limit: number;
  total: number;
  last_page: number;
}

// ── Filters ────────────────────────────────────────────────────────────────

export interface UserMessageFilters {
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

// ── API ────────────────────────────────────────────────────────────────────

export const userMessagesApi = {
  /** GET /user-messages */
  list: (filters: UserMessageFilters = {}) =>
    client.get<{
      success: true;
      data: UserMessage[];
      meta: UserMessageListMeta;
    }>('/user-messages', { params: filters }),

  /** GET /user-messages/popular */
  popular: (limit = 5) =>
    client.get<{ success: true; data: PopularUserMessage[] }>('/user-messages/popular', {
      params: { limit },
    }),

  /** GET /user-messages/:id */
  get: (id: string) =>
    client.get<{ success: true; data: UserMessage }>(`/user-messages/${id}`),

  /** DELETE /user-messages/:id (soft delete) */
  delete: (id: string) =>
    client.delete<{ success: true }>(`/user-messages/${id}`),

  /** POST /user-messages/:id/restore */
  restore: (id: string) =>
    client.post<{ success: true; data: UserMessage }>(
      `/user-messages/${id}/restore`,
    ),

  /** DELETE /user-messages/:id/force (permanent) */
  forceDelete: (id: string) =>
    client.delete<{ success: true }>(`/user-messages/${id}/force`),
};
