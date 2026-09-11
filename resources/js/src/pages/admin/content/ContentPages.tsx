import { useEffect, useState, type ReactNode } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { sectionComponents } from './sections';
import {
  FileText,
  ChevronRight,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import './content.css';
import { contentApi } from '@/api/content.api';
import { Link } from '@inertiajs/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SectionType = 'dedicated' | 'generic';

interface SectionMeta {
  key: string;
  label: string;
  type: SectionType;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Keys that have a dedicated structured editor */
const DEDICATED_KEYS = new Set(
  Object.keys(sectionComponents).filter((k) => k !== 'generic')
);

function buildMeta(apiKeys: string[]): SectionMeta[] {
  return apiKeys.map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    type: DEDICATED_KEYS.has(key) ? 'dedicated' : 'generic',
  }));
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// ---------------------------------------------------------------------------
// SectionCard
// ---------------------------------------------------------------------------

function SectionCard({
  meta,
  updatedAt,
  // onClick,
}: {
  meta: SectionMeta;
  updatedAt?: string;
  onClick: () => void;
}) {
  const relativeTime = updatedAt ? formatRelative(updatedAt) : null;
  return (
    <Link
          key={meta.key}
          href={'/admin/content/' + slugify(meta.key)}
          className= 'cp-card'
        >
      <div className="cp-card-icon-wrap">
        <FileText size={17} />
      </div>

      <div className="cp-card-body">
        <div className="cp-card-title">{meta.label}</div>
        <div className="cp-card-badge-row">
          <span className={`cp-type-badge cp-type-${meta.type}`}>
            {meta.type === 'dedicated' ? 'Dedicated editor' : 'Chat flow'}
          </span>
          {relativeTime && (
            <span className="cp-card-meta">Updated {relativeTime}</span>
          )}
        </div>
      </div>

      <ChevronRight size={15} className="cp-card-arrow" />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// GroupSection
// ---------------------------------------------------------------------------

function GroupSection({
  title,
  subtitle,
  sections,
  updatedMap,
  onNavigate,
}: {
  title: string;
  subtitle: string;
  sections: SectionMeta[];
  updatedMap: Record<string, string>;
  onNavigate: (key: string) => void;
}) {
  if (sections.length === 0) return null;

  return (
    <div className="cp-group">
      <div className="cp-group-header">
        <div>
          <h2 className="cp-group-title">{title}</h2>
          <p className="cp-group-subtitle">{subtitle}</p>
        </div>
        <span className="cp-group-count">{sections.length}</span>
      </div>
      <div className="cp-card-grid">
        {sections.map((meta) => (
          <SectionCard
            key={meta.key}
            meta={meta}
            updatedAt={updatedMap[meta.key]}
            onClick={() => onNavigate(meta.key)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NewSectionModal
// ---------------------------------------------------------------------------

interface NewSectionModalProps {
  existingKeys: string[];
  onClose: () => void;
  onCreated: (key: string) => void;
}

function NewSectionModal({ existingKeys, onClose, onCreated }: NewSectionModalProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const slug = slugify(name);
  const isDuplicate = existingKeys.includes(slug);
  const isValid = slug.length > 0 && !isDuplicate;

  const handleCreate = async () => {
    if (!isValid) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await contentApi.create(slug, { blocks: [], buttons: [], triggers: '' });
      onCreated(slug);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') onClose();
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="cp-modal-backdrop" onClick={handleBackdrop}>
      <div className="cp-modal" role="dialog" aria-modal="true" aria-labelledby="cp-modal-title">
        <div className="cp-modal-header">
          <div className="cp-modal-icon">
            <Plus size={18} />
          </div>
          <div className="cp-modal-header-text">
            <h2 id="cp-modal-title">New Chat Flow Section</h2>
            <p>Creates a generic content block the chat bot can serve.</p>
          </div>
          <button className="cp-modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="cp-modal-body">
          <div className="field-group">
            <label htmlFor="cp-section-name">Section name</label>
            <input
              id="cp-section-name"
              type="text"
              placeholder="e.g. languages, salary, location"
              value={name}
              onChange={(e) => { setName(e.target.value); setStatus('idle'); setErrorMsg(''); }}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
            />
          </div>

          {name.length > 0 && (
            <div className={`cp-slug-preview ${isDuplicate ? 'error' : ''}`}>
              <span className="cp-slug-label">URL key</span>
              <code className="cp-slug-value">/admin/content/{slug || '…'}</code>
              {isDuplicate && (
                <span className="cp-slug-error">A section with this key already exists.</span>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="cp-modal-error">{errorMsg}</div>
          )}
        </div>

        <div className="cp-modal-footer">
          <button className="cp-modal-btn-cancel" onClick={onClose} disabled={status === 'loading'}>
            Cancel
          </button>
          <button
            className="cp-modal-btn-create"
            onClick={handleCreate}
            disabled={!isValid || status === 'loading'}
          >
            {status === 'loading' ? (
              <><Loader2 size={14} className="cp-spin" /> Creating…</>
            ) : (
              <><Plus size={14} /> Create section</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContentPages
// ---------------------------------------------------------------------------

function ContentPages() {
  const [allMeta, setAllMeta] = useState<SectionMeta[]>([]);
  const [updatedMap, setUpdatedMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    contentApi.getAll().then((res) => {
      const data = res.data.data ?? {};
      const keys = Object.keys(data);

      setAllMeta(buildMeta(keys));

      const times: Record<string, string> = {};
      Object.entries(data).forEach(([key, val]) => {
        const v = val as Record<string, unknown>;
        if (v?.updated_at && typeof v.updated_at === 'string') {
          times[key] = v.updated_at;
        }
      });
      setUpdatedMap(times);
      setLoading(false);
    });
  }, []);

  const navigate = (key: string) => {
    window.location.href = `/admin/content/${key}`;
  };

  const dedicatedMeta = allMeta.filter((m) => m.type === 'dedicated');
  const genericMeta   = allMeta.filter((m) => m.type === 'generic');
  const existingKeys  = allMeta.map((m) => m.key);

  const sorted = Object.values(updatedMap).sort();
  const lastEdited = sorted[sorted.length - 1];

  return (
    <div className="content-page">
      {/* Header */}
      <div className="content-page-header cp-page-header">
        <div>
          <h1>Content Manager</h1>
          <p>
            Manage every section of your portfolio. Changes are saved to the
            database and reflected live on the site.
          </p>
        </div>
        <button className="btn-add cp-btn-new-section" onClick={() => setShowModal(true)}>
          <Plus size={15} /> New Section
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <NewSectionModal
          existingKeys={existingKeys}
          onClose={() => setShowModal(false)}
          onCreated={(key) => {
            setShowModal(false);
            window.location.href = `/admin/content/${key}`;
          }}
        />
      )}

      {/* Summary strip */}
      <div className="cp-summary-strip">
        <div className="cp-summary-item">
          <span className="cp-summary-value">{loading ? '—' : allMeta.length}</span>
          <span className="cp-summary-label">Total sections</span>
        </div>
        <div className="cp-summary-divider" />
        <div className="cp-summary-item">
          <span className="cp-summary-value">{loading ? '—' : dedicatedMeta.length}</span>
          <span className="cp-summary-label">Dedicated editors</span>
        </div>
        <div className="cp-summary-divider" />
        <div className="cp-summary-item">
          <span className="cp-summary-value">{loading ? '—' : genericMeta.length}</span>
          <span className="cp-summary-label">Chat flow sections</span>
        </div>
        {lastEdited && (
          <>
            <div className="cp-summary-divider" />
            <div className="cp-summary-item">
              <span className="cp-summary-value">{formatRelative(lastEdited)}</span>
              <span className="cp-summary-label">Last edited</span>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="cp-body">
        {loading ? (
          <div className="editor-loading">Loading sections…</div>
        ) : (
          <>
            <GroupSection
              title="Portfolio Sections"
              subtitle="Structured editors for the main sections of your portfolio site."
              sections={dedicatedMeta}
              updatedMap={updatedMap}
              onNavigate={navigate}
            />
            <GroupSection
              title="Chat Flow Sections"
              subtitle="Free-form content blocks served by the chat bot in response to visitor queries."
              sections={genericMeta}
              updatedMap={updatedMap}
              onNavigate={navigate}
            />
          </>
        )}
      </div>
    </div>
  );
}

ContentPages.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default ContentPages;