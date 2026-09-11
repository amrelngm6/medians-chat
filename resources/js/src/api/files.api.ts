import client from './client';

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  modified: string;
  permissions: string; // octal, e.g. "755"
}

export interface PermissionsInfo {
  path: string;
  mode: string;
  isDirectory: boolean;
}

export interface BulkResult {
  deleted: string[];
  failed: { path: string; error: string }[];
}

export interface UploadResult {
  saved: string[];
  failed: { name: string; error: string }[];
}

export const filesApi = {
  list: (path?: string) => client.get<{ entries: FileEntry[] }>('/files', { params: { path } }),

  viewUrl: (path: string) => {
    // Remove public/ from the beginning
    const filteredPath = path.replace(/^public\//, '');
    return `/${encodeURIComponent(filteredPath)}`;
  },

  upload: (path: string, files: File[], onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('path', path);
    files.forEach((file) => formData.append('files', file));
    return client.post<UploadResult>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
      },
    });
  },

  delete: (path: string) => client.delete<{ success: boolean; error?: string }>('/files', { data: { path } }),
};
