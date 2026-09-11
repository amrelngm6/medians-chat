import client from './client';

type SettingType = 'text' | 'integer' | 'boolean' | 'select' | 'textarea';

export interface Setting {
  id: number;
  group: string;
  key: string;
  label: string;
  value: string | number | boolean | null;
  type: SettingType;
  options: string[];
  description: string | null;
  is_public: boolean;
  sort_order: number;
}

export type GroupedSettings = Record<string, Setting[]>;

export type MenuItem = {
  title: string;
  url: string;
  icon: string;
};

export type MenuSection = {
  icon: string;
  items: MenuItem[];
};

export type Menu = Record<string, MenuSection>;

export const settingsApi = {
  list: () => client.get<{ data: GroupedSettings }>('/settings'),

  groups: () => client.get<{ data: GroupedSettings }>('/settings/groups'),

  group: (group: string) => client.get<{ data: Setting[], meta: any }>(`/settings/groups/${group}`),

  update: (data: Record<string, unknown>) =>
    client.put<{ data: Setting }>(`/settings`, { settings: data }),


  // Load Admin Menu
  adminMenu: () => client.get<{ data: Menu }>(`/admin-menu`),

};
