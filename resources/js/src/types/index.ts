export type UserRole = 'admin' | 'reseller' | 'client';


export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  status: 'active' | 'inactive';
  email_verified_at: Date | null;
  last_login_at: Date | null;
  avatar_url: string | null;
  timezone: string;
  preferences: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  is_active: boolean;
}

export interface SystemStats {
  cpu: { model: string; cores: number; usage: number };
  memory: { total: number; used: number; free: number; percentage: number };
  disk: Array<{
    filesystem: string;
    size: string;
    used: string;
    available: string;
    percentage: string;
    mountpoint: string;
  }>;
  uptime: number;
  loadAverage: [number, number, number];
  hostname: string;
  platform: string;
}