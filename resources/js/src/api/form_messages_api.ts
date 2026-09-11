import client from './client';

// ── Types ──────────────────────────────────────────────────────────────────

export type FormMessageStatus = 'new' | 'read' | 'replied' | 'archived' | 'spam';

export interface FormMessage {
  id: string;
  form_key: string;
  status: FormMessageStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  meta: Record<string, unknown> | null;
  reply: string | null;
  replied_at: string | null;
  user: { id: string; name: string; email: string } | null;
  handler: { id: string; name: string; email: string } | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FormMessageListMeta {
  page: number;
  limit: number;
  total: number;
  last_page: number;
}

export interface FormMessageCounts {
  new?: number;
  read?: number;
  replied?: number;
  archived?: number;
  spam?: number;
}

// ── Filters ────────────────────────────────────────────────────────────────

export interface FormMessageFilters {
  status?: FormMessageStatus;
  form_key?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ── API ────────────────────────────────────────────────────────────────────

export const formMessagesApi = {
  // ── Public ───────────────────────────────────────────────────────────────

  /** POST /form-messages — no auth required */
  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    form_key?: string;
    meta?: Record<string, unknown>;
  }) =>
    client.post<{ success: true; message: FormMessage }>('/form-messages', data),

  // ── Admin ─────────────────────────────────────────────────────────────────

  /** GET /form-messages */
  list: (filters: FormMessageFilters = {}) =>
    client.get<{
      success: true;
      data: FormMessage[];
      meta: FormMessageListMeta;
      counts: FormMessageCounts;
    }>('/form-messages', { params: filters }),

  /** GET /form-messages/stats */
  stats: () =>
    client.get<{
      success: true;
      data: { counts: FormMessageCounts; unread: number };
    }>('/form-messages/stats'),

  /** GET /form-messages/:id */
  get: (id: string) =>
    client.get<{ success: true; data: FormMessage }>(`/form-messages/${id}`),

  /** PATCH /form-messages/:id/status */
  updateStatus: (id: string, status: FormMessageStatus) =>
    client.patch<{ success: true; data: FormMessage }>(
      `/form-messages/${id}/status`,
      { status },
    ),

  /** POST /form-messages/:id/reply */
  reply: (id: string, reply: string) =>
    client.post<{ success: true; data: FormMessage }>(
      `/form-messages/${id}/reply`,
      { reply },
    ),

  /** DELETE /form-messages/:id  (soft delete) */
  delete: (id: string) =>
    client.delete<{ success: true }>(`/form-messages/${id}`),

  /** POST /form-messages/:id/restore */
  restore: (id: string) =>
    client.post<{ success: true; data: FormMessage }>(
      `/form-messages/${id}/restore`,
    ),

  /** DELETE /form-messages/:id/force  (permanent) */
  forceDelete: (id: string) =>
    client.delete<{ success: true }>(`/form-messages/${id}/force`),
};
