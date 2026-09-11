
export interface HomeMenu {
  id: string;
  title: string;
  icon: string | null;
  url: string | null;
  target: '_self' | '_blank';
  sort_order: number;
  is_active: boolean;
  parent_id: string | null;
  children?: HomeMenu[];
}

export type FormErrors = Record<string, string>;

export type DrawerMode = 'create' | 'edit';

export interface MenuFormData {
  title: string;
  icon: string;
  url: string;
  target: '_self' | '_blank';
  sort_order: number;
  is_active: boolean;
  parent_id: string;
}