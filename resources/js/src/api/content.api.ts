import client from './client';

export interface ContentSection {
  id: string;
  section_key: string;
  locale: string;
  data: Record<string, unknown>;
  updated_at: string;
}

export const contentApi = {
  /** GET /content — returns all sections as a key→data map */
  getAll: (locale = 'en') =>
    client.get<{ success: true; data: Record<string, Record<string, unknown>> }>('/content', { params: { locale } }),

  /** GET /content/:key — returns one section */
  getByKey: (key: string, locale = 'en') =>
    client.get<{ success: true; data: ContentSection }>(`/content/${key}`, { params: { locale } }),

  /** CREATE /content/:key — create one section (admin only) */
  create: (key: string, data: Record<string, unknown>, locale = 'en') =>
    client.post<{ success: true; data: ContentSection }>(`/content/${key}`, { data }, { params: { locale } }),

  /** PUT /content/:key — save one section (admin only) */
  update: (key: string, data: Record<string, unknown>, locale = 'en') =>
    client.put<{ success: true; data: ContentSection }>(`/content/${key}`, { data }, { params: { locale } }),
};
