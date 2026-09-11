import { useEffect, useRef, useState, ReactNode, useMemo } from 'react';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  Image as ImageIcon,
  Folder,
  FileImage,
  FileText,
  FileVideo,
  File as FileIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Download,
  RefreshCw,
  Grid,
  List,
  X,
  ChevronRight,
  Home,
  AlertCircle,
  CheckCircle2,
  Loader2,
  HardDrive,
  Eye,
  Info,
  Clock,
  Lock,
} from 'lucide-react';
import './mediaLibrary.css';
import { filesApi, FileEntry } from '../../../api/files.api';

// ---------------------------------------------------------------------------
// File Extensions & Helpers
// ---------------------------------------------------------------------------

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)$/i;
const DOC_EXT = /\.(pdf|txt|doc|docx|xls|xlsx|ppt|pptx|csv|json)$/i;

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

function joinPath(dir: string, name: string): string {
  if (dir === '/' || dir === '') return `/${name}`;
  return `${dir.replace(/\/$/, '')}/${name}`;
}

// ---------------------------------------------------------------------------
// FilePreview Component
// ---------------------------------------------------------------------------

interface FilePreviewProps {
  entry: FileEntry;
  className?: string;
}

function FilePreview({ entry, className }: FilePreviewProps) {
  if (entry.type === 'directory') {
    return <Folder size={32} className={`media-library-card-icon ${className || ''}`} style={{ color: '#6366f1' }} />;
  }

  if (IMAGE_EXT.test(entry.name)) {
    return (
      <img
        src={filesApi.viewUrl(entry.path)}
        alt={entry.name}
        loading="lazy"
        className={className}
      />
    );
  }

  if (VIDEO_EXT.test(entry.name)) {
    return <FileVideo size={32} className={`media-library-card-icon ${className || ''}`} style={{ color: '#8b5cf6' }} />;
  }

  if (DOC_EXT.test(entry.name)) {
    return <FileText size={32} className={`media-library-card-icon ${className || ''}`} style={{ color: '#10b981' }} />;
  }

  return <FileIcon size={32} className={`media-library-card-icon ${className || ''}`} style={{ color: '#6b7280' }} />;
}

// ---------------------------------------------------------------------------
// FileCard Component — Grid View Item
// ---------------------------------------------------------------------------

interface FileCardProps {
  entry: FileEntry;
  onOpen: (entry: FileEntry) => void;
  onDelete: (entry: FileEntry) => void;
  onCopyUrl: (path: string) => void;
}

function FileCard({ entry, onOpen, onDelete, onCopyUrl }: FileCardProps) {
  return (
    <div className="media-library-card" onClick={() => onOpen(entry)}>
      <div className="media-library-card-thumb">
        <FilePreview entry={entry} />
        <div className="media-library-card-overlay" onClick={(e) => e.stopPropagation()}>
          <button
            className="media-library-action-btn overlay"
            title="View Details"
            onClick={() => onOpen(entry)}
          >
            <Eye size={14} />
          </button>

          {entry.type === 'file' && (
            <>
              <button
                className="media-library-action-btn overlay"
                title="Copy Direct Link"
                onClick={() => onCopyUrl(entry.path)}
              >
                <Copy size={14} />
              </button>
              <a
                href={filesApi.viewUrl(entry.path)}
                target="_blank"
                rel="noreferrer"
                className="media-library-action-btn overlay"
                title="Open in new tab"
                download
              >
                <Download size={14} />
              </a>
            </>
          )}

          <button
            className="media-library-action-btn overlay danger"
            title="Delete File"
            onClick={() => onDelete(entry)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="media-library-card-body">
        <span className="media-library-card-title" title={entry.name}>
          {entry.name}
        </span>
        <div className="media-library-card-meta">
          <span>{entry.type === 'directory' ? 'Folder' : formatBytes(entry.size)}</span>
          <span>{entry.modified ? formatDate(entry.modified).split(',')[0] : ''}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FileRow Component — List Table View Row
// ---------------------------------------------------------------------------

interface FileRowProps {
  entry: FileEntry;
  onOpen: (entry: FileEntry) => void;
  onDelete: (entry: FileEntry) => void;
  onCopyUrl: (path: string) => void;
}

function FileRow({ entry, onOpen, onDelete, onCopyUrl }: FileRowProps) {
  const fileTypeLabel = useMemo(() => {
    if (entry.type === 'directory') return 'Folder';
    if (IMAGE_EXT.test(entry.name)) return 'Image';
    if (VIDEO_EXT.test(entry.name)) return 'Video';
    if (DOC_EXT.test(entry.name)) return 'Document';
    return 'File';
  }, [entry]);

  return (
    <div className="media-library-row" onClick={() => onOpen(entry)}>
      {/* Thumbnail */}
      <div className="media-library-row-thumb">
        <FilePreview entry={entry} />
      </div>

      {/* Name & Path */}
      <div className="media-library-row-info">
        <span className="media-library-row-name" title={entry.name}>
          {entry.name}
        </span>
        <span className="media-library-row-path" title={entry.path}>
          {entry.path}
        </span>
      </div>

      {/* Type */}
      <div>
        <span className="media-library-row-type">{fileTypeLabel}</span>
      </div>

      {/* Size */}
      <div style={{ fontSize: 12.5, color: 'var(--text-dark)' }}>
        {entry.type === 'directory' ? '—' : formatBytes(entry.size)}
      </div>

      {/* Date */}
      <div className="media-library-row-date">{formatDate(entry.modified)}</div>

      {/* Actions */}
      <div className="media-library-row-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="media-library-action-btn primary"
          title="View Info"
          onClick={() => onOpen(entry)}
        >
          <Eye size={13} />
        </button>

        {entry.type === 'file' && (
          <button
            className="media-library-action-btn"
            title="Copy URL"
            onClick={() => onCopyUrl(entry.path)}
          >
            <Copy size={13} />
          </button>
        )}

        <button
          className="media-library-action-btn danger"
          title="Delete"
          onClick={() => onDelete(entry)}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeleteConfirmModal
// ---------------------------------------------------------------------------

interface DeleteConfirmProps {
  entry: FileEntry;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmModal({ entry, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <div className="media-library-modal-overlay" onClick={onCancel}>
      <div className="media-library-modal" onClick={(e) => e.stopPropagation()}>
        <div className="media-library-modal-header">
          <Trash2 size={16} />
          <h3>Delete File</h3>
        </div>
        <div className="media-library-modal-body">
          <p>
            Are you sure you want to delete <strong>"{entry.name}"</strong>?
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Path: <code style={{ wordBreak: 'break-all' }}>{entry.path}</code>
          </p>
        </div>
        <div className="media-library-modal-footer">
          <button className="btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={13} className="spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 size={13} /> Delete File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MediaDetailDrawer — slide-in panel for view & info
// ---------------------------------------------------------------------------

interface MediaDetailDrawerProps {
  entry: FileEntry;
  onClose: () => void;
  onDelete: (entry: FileEntry) => void;
  onCopyUrl: (path: string) => void;
}

function MediaDetailDrawer({ entry, onClose, onDelete, onCopyUrl }: MediaDetailDrawerProps) {
  const publicUrl = window.location.origin + filesApi.viewUrl(entry.path);

  return (
    <div className="media-library-drawer-overlay" onClick={onClose}>
      <aside className="media-library-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="media-library-drawer-header">
          <div className="media-library-drawer-header-left">
            <ImageIcon size={16} />
            <div>
              <h2>{entry.name}</h2>
              <p>{entry.path}</p>
            </div>
          </div>
          <button className="media-library-drawer-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="media-library-drawer-body">
          {/* Preview Box */}
          <div className="media-library-preview-box">
            {entry.type === 'directory' ? (
              <div className="media-library-preview-placeholder">
                <Folder size={48} style={{ color: '#6366f1' }} />
                <span>Directory Folder</span>
              </div>
            ) : IMAGE_EXT.test(entry.name) ? (
              <img src={filesApi.viewUrl(entry.path)} alt={entry.name} />
            ) : VIDEO_EXT.test(entry.name) ? (
              <video src={filesApi.viewUrl(entry.path)} controls />
            ) : (
              <div className="media-library-preview-placeholder">
                <FileIcon size={48} style={{ color: '#6b7280' }} />
                <span>{entry.name}</span>
              </div>
            )}
          </div>

          {/* Metadata Card */}
          <div className="media-library-info-card">
            <div className="media-library-info-row">
              <span className="media-library-info-label">
                <Info size={13} /> File Name:
              </span>
              <span className="media-library-info-val">{entry.name}</span>
            </div>
            <div className="media-library-info-row">
              <span className="media-library-info-label">
                <HardDrive size={13} /> Size:
              </span>
              <span className="media-library-info-val">
                {entry.type === 'directory' ? 'Directory' : formatBytes(entry.size)}
              </span>
            </div>
            <div className="media-library-info-row">
              <span className="media-library-info-label">
                <Clock size={13} /> Modified:
              </span>
              <span className="media-library-info-val">{formatDate(entry.modified)}</span>
            </div>
            {entry.permissions && (
              <div className="media-library-info-row">
                <span className="media-library-info-label">
                  <Lock size={13} /> Permissions:
                </span>
                <span className="media-library-info-val">{entry.permissions}</span>
              </div>
            )}
          </div>

          {/* Public URL Box */}
          {entry.type === 'file' && (
            <div className="media-library-url-box">
              <label>Public URL</label>
              <div className="media-library-url-input-wrap">
                <input
                  type="text"
                  readOnly
                  className="media-library-url-input"
                  value={publicUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  className="btn-ghost"
                  title="Copy URL to clipboard"
                  onClick={() => onCopyUrl(entry.path)}
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="media-library-drawer-footer">
          <div style={{ display: 'flex', gap: 8 }}>
            {entry.type === 'file' && (
              <a
                href={filesApi.viewUrl(entry.path)}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
                download
              >
                <Download size={13} /> Download
              </a>
            )}
            <button
              className="btn-danger"
              onClick={() => onDelete(entry)}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MediaLibraryPage Component
// ---------------------------------------------------------------------------

function MediaLibraryPage() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters & Views
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'image' | 'doc' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Selected item / modals
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileEntry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Uploading state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Feedback notification
  const [globalMsg, setGlobalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch Files ────────────────────────────────────────────────────────────

  const fetchFiles = (path = currentPath) => {
    setLoading(true);
    setFetchError(null);

    filesApi
      .list(path)
      .then((res) => {
        setEntries(res.data.entries || []);
      })
      .catch(() => setFetchError('Failed to load files from storage. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  // ── Flash Notification ─────────────────────────────────────────────────────

  const flash = (type: 'success' | 'error', text: string) => {
    setGlobalMsg({ type, text });
    setTimeout(() => setGlobalMsg(null), 3500);
  };

  // ── Copy URL ───────────────────────────────────────────────────────────────

  const handleCopyUrl = (path: string) => {
    const fullUrl = window.location.origin + filesApi.viewUrl(path);
    navigator.clipboard.writeText(fullUrl).then(() => {
      flash('success', 'Public file URL copied to clipboard!');
    }).catch(() => {
      flash('error', 'Could not copy URL to clipboard.');
    });
  };

  // ── Search & Filter ────────────────────────────────────────────────────────

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        if (!entry.name.toLowerCase().includes(query) && !entry.path.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Type filter
      if (fileTypeFilter === 'image' && entry.type === 'file' && !IMAGE_EXT.test(entry.name)) return false;
      if (fileTypeFilter === 'doc' && entry.type === 'file' && !DOC_EXT.test(entry.name)) return false;
      if (fileTypeFilter === 'video' && entry.type === 'file' && !VIDEO_EXT.test(entry.name)) return false;

      return true;
    });
  }, [entries, search, fileTypeFilter]);

  // Counts for Stats Bar
  const stats = useMemo(() => {
    let images = 0;
    let docs = 0;
    let videos = 0;
    let totalSize = 0;

    entries.forEach((e) => {
      if (e.type === 'file') {
        totalSize += e.size || 0;
        if (IMAGE_EXT.test(e.name)) images++;
        else if (VIDEO_EXT.test(e.name)) videos++;
        else if (DOC_EXT.test(e.name)) docs++;
      }
    });

    return {
      total: entries.length,
      images,
      docs,
      videos,
      totalSize: formatBytes(totalSize),
    };
  }, [entries]);

  // ── Breadcrumbs Navigation ─────────────────────────────────────────────────

  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    const crumbs = [{ label: 'Root', path: '/' }];
    let acc = '';
    for (const part of parts) {
      acc += `/${part}`;
      crumbs.push({ label: part, path: acc });
    }
    return crumbs;
  }, [currentPath]);

  // ── Upload Handlers ────────────────────────────────────────────────────────

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const res = await filesApi.upload(currentPath, fileList, (pct) => setUploadProgress(pct));
      if (res.data.failed && res.data.failed.length > 0) {
        flash('error', `Upload completed with errors: ${res.data.failed.map((f) => f.error).join(', ')}`);
      } else {
        flash('success', `Uploaded ${fileList.length} file(s) successfully.`);
      }
      fetchFiles(currentPath);
    } catch {
      flash('error', 'Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Delete File Handler ────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    try {
      await filesApi.delete(deleteTarget.path);
      flash('success', `File "${deleteTarget.name}" deleted successfully.`);
      if (selectedFile?.path === deleteTarget.path) {
        setSelectedFile(null);
      }
      fetchFiles(currentPath);
    } catch {
      flash('error', 'Could not delete file. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  // ── Open item (File or Directory) ──────────────────────────────────────────

  const handleOpenItem = (entry: FileEntry) => {
    if (entry.type === 'directory') {
      setCurrentPath(joinPath(currentPath, entry.name));
    } else {
      setSelectedFile(entry);
    }
  };

  return (
    <div className="media-library-page">
      {/* Page Header */}
      <div className="media-library-page-header">
        <div className="media-library-page-header-left">
          <h1>
            <FileImage size={20} />
            Media Library
          </h1>
          <p>Browse, upload, preview, and manage your assets and media files.</p>
        </div>

        <div className="media-library-header-actions">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleUploadFiles(e.target.files)}
          />
          <button
            className="btn-add"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="spin" /> Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={14} /> Upload Media
              </>
            )}
          </button>

          <button
            className="btn-ghost"
            onClick={() => fetchFiles(currentPath)}
            title="Refresh files"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="media-library-stats-bar">
        <button
          className={`media-library-stat ${fileTypeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setFileTypeFilter('all')}
        >
          <FileImage size={13} />
          <span>
            <strong>{stats.total}</strong> All Files ({stats.totalSize})
          </span>
        </button>

        <button
          className={`media-library-stat ${fileTypeFilter === 'image' ? 'active' : ''}`}
          onClick={() => setFileTypeFilter('image')}
        >
          <ImageIcon size={13} />
          <span>
            <strong>{stats.images}</strong> Images
          </span>
        </button>

        <button
          className={`media-library-stat ${fileTypeFilter === 'doc' ? 'active' : ''}`}
          onClick={() => setFileTypeFilter('doc')}
        >
          <FileText size={13} />
          <span>
            <strong>{stats.docs}</strong> Documents
          </span>
        </button>

        <button
          className={`media-library-stat ${fileTypeFilter === 'video' ? 'active' : ''}`}
          onClick={() => setFileTypeFilter('video')}
        >
          <FileVideo size={13} />
          <span>
            <strong>{stats.videos}</strong> Videos
          </span>
        </button>
      </div>

      {/* Search & Filter & View Toggle Bar */}
      <div className="media-library-filters">
        <form className="media-library-search-box" onSubmit={(e) => e.preventDefault()}>
          <Search size={14} />
          <input
            type="text"
            className="media-library-search-input"
            placeholder="Search by file name or path..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearch(e.target.value);
            }}
          />
          {searchInput && (
            <button
              type="button"
              className="media-library-clear-btn"
              onClick={() => {
                setSearchInput('');
                setSearch('');
              }}
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </form>

        <div className="media-library-filter-group">
          <select
            className="media-library-select"
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as any)}
          >
            <option value="all">All File Types</option>
            <option value="image">Images Only</option>
            <option value="doc">Documents Only</option>
            <option value="video">Videos Only</option>
          </select>

          <div className="media-library-view-toggle">
            <button
              className={`media-library-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              className={`media-library-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Table List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Breadcrumbs Bar */}
      <div className="media-library-breadcrumbs">
        {breadcrumbs.map((c, i) => (
          <span key={c.path} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />}
            <button
              className="media-library-breadcrumb-item"
              onClick={() => setCurrentPath(c.path)}
            >
              {i === 0 && <Home size={13} />}
              {c.label}
            </button>
          </span>
        ))}
      </div>

      {/* Global Feedback Banner */}
      {globalMsg && (
        <p className={`media-library-feedback ${globalMsg.type}`}>
          {globalMsg.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          {globalMsg.text}
        </p>
      )}

      {/* Main Content Area */}
      <div className="media-library-content-area">
        {loading ? (
          <div className="media-library-loading">
            <Loader2 size={18} className="spin" /> Loading files from storage…
          </div>
        ) : fetchError ? (
          <div className="media-library-loading" style={{ color: '#dc2626' }}>
            <AlertCircle size={18} /> {fetchError}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="media-library-empty">
            <FileImage size={40} />
            <p>No media files found</p>
            <span>Upload new files or try changing your search query or filter.</span>
            <button
              className="btn-add"
              style={{ margin: '12px auto' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} /> Upload Files
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="media-library-grid-container">
            <div className="media-library-grid">
              {filteredEntries.map((entry) => (
                <FileCard
                  key={entry.path}
                  entry={entry}
                  onOpen={handleOpenItem}
                  onDelete={(e) => setDeleteTarget(e)}
                  onCopyUrl={handleCopyUrl}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Table List View */
          <>
            <div className="media-library-list-header">
              <span>Preview</span>
              <span>Name & Path</span>
              <span>Type</span>
              <span>Size</span>
              <span>Modified</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>
            <div className="media-library-list">
              {filteredEntries.map((entry) => (
                <FileRow
                  key={entry.path}
                  entry={entry}
                  onOpen={handleOpenItem}
                  onDelete={(e) => setDeleteTarget(e)}
                  onCopyUrl={handleCopyUrl}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Slide-in Detail Drawer */}
      {selectedFile && (
        <MediaDetailDrawer
          entry={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDelete={(e) => setDeleteTarget(e)}
          onCopyUrl={handleCopyUrl}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          entry={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inertia Layout Wrapper
// ---------------------------------------------------------------------------

MediaLibraryPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default MediaLibraryPage;
