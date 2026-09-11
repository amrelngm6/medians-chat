import { useEffect, useRef, useState, ReactNode } from 'react';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  MessageCircle,
  Search,
  Trash2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Eye,
  RefreshCw,
  X,
  Clock,
  Globe,
  Monitor,
  AlertCircle,
  CheckCircle2,
  CalendarRange,
  Filter,
  RotateCcw,
  Hash,
} from 'lucide-react';
import './userMessages.css';
import {
  userMessagesApi,
  UserMessage,
  UserMessageListMeta,
  UserMessageFilters,
} from '../../../api/user_messages_api';

// ---------------------------------------------------------------------------
// Helpers & Formatting
// ---------------------------------------------------------------------------

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

function shortenBrowser(browser: string | null): string {
  if (!browser) return 'Unknown';
  // Attempt to extract a short browser/UA summary
  if (browser.includes('Chrome')) return 'Chrome';
  if (browser.includes('Firefox')) return 'Firefox';
  if (browser.includes('Safari') && !browser.includes('Chrome')) return 'Safari';
  if (browser.includes('Edge')) return 'Edge';
  if (browser.includes('Opera') || browser.includes('OPR')) return 'Opera';
  if (browser.includes('curl')) return 'cURL';
  if (browser.includes('Postman')) return 'Postman';
  // Fall back to first 28 chars
  return browser.length > 28 ? browser.slice(0, 28) + '…' : browser;
}

// ---------------------------------------------------------------------------
// MessageRow — single row in the table list
// ---------------------------------------------------------------------------

interface MessageRowProps {
  item: UserMessage;
  onOpen: (item: UserMessage) => void;
  onDelete: (item: UserMessage) => void;
}

function MessageRow({ item, onOpen, onDelete }: MessageRowProps) {
  return (
    <div
      className="user-messages-row"
      onClick={() => onOpen(item)}
      title="Click to view full message"
    >
      {/* Message preview */}
      <div className="user-messages-row-message">
        <span className="user-messages-row-message-text">{item.message}</span>
      </div>

      {/* IP */}
      <div className="user-messages-row-ip">
        <Globe size={11} />
        {item.ip || '—'}
      </div>

      {/* Browser */}
      <div>
        <span className="user-messages-row-browser">
          <Monitor size={10} />
          {shortenBrowser(item.browser)}
        </span>
      </div>

      {/* Date */}
      <div className="user-messages-row-date">
        {formatDate(item.created_at)}
      </div>

      {/* Actions */}
      <div
        className="user-messages-row-actions"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="user-messages-action-btn primary"
          title="View message"
          onClick={() => onOpen(item)}
          id={`view-msg-${item.id}`}
        >
          <Eye size={13} />
        </button>

        <button
          className="user-messages-action-btn danger"
          title="Delete message"
          onClick={() => onDelete(item)}
          id={`delete-msg-${item.id}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MessageList — table list component
// ---------------------------------------------------------------------------

interface MessageListProps {
  items: UserMessage[];
  onOpen: (item: UserMessage) => void;
  onDelete: (item: UserMessage) => void;
}

function MessageList({ items, onOpen, onDelete }: MessageListProps) {
  if (!items.length) {
    return (
      <div className="user-messages-empty">
        <MessageCircle size={36} />
        <p>No messages found.</p>
        <span>No user messages match the selected filter or search query.</span>
      </div>
    );
  }

  return (
    <div className="user-messages-list">
      {items.map((item) => (
        <MessageRow
          key={item.id}
          item={item}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeleteConfirmModal
// ---------------------------------------------------------------------------

interface DeleteConfirmProps {
  item: UserMessage;
  onConfirm: (permanent: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmModal({ item, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  const [permanent, setPermanent] = useState(false);

  return (
    <div
      className="user-messages-modal-overlay"
      onClick={onCancel}
      id="delete-confirm-overlay"
    >
      <div
        className="user-messages-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-messages-modal-header">
          <Trash2 size={16} />
          <h3>Delete user message</h3>
        </div>
        <div className="user-messages-modal-body">
          <p>Are you sure you want to delete this message?</p>
          <div className="message-preview">{item.message}</div>
          <div style={{ marginTop: 14 }}>
            <label
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                id="permanent-delete-check"
                checked={permanent}
                onChange={(e) => setPermanent(e.target.checked)}
              />
              <span>Delete permanently (cannot be restored)</span>
            </label>
          </div>
        </div>
        <div className="user-messages-modal-footer">
          <button
            className="um-btn-ghost"
            onClick={onCancel}
            disabled={loading}
            id="cancel-delete-btn"
          >
            Cancel
          </button>
          <button
            className="um-btn-danger"
            onClick={() => onConfirm(permanent)}
            disabled={loading}
            id="confirm-delete-btn"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="um-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 size={13} /> {permanent ? 'Delete permanently' : 'Delete'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MessageDrawer — slide-in panel to view full message
// ---------------------------------------------------------------------------

interface MessageDrawerProps {
  item: UserMessage;
  onClose: () => void;
  onDelete: (item: UserMessage) => void;
}

function MessageDrawer({ item, onClose, onDelete }: MessageDrawerProps) {
  return (
    <div
      className="user-messages-drawer-overlay"
      onClick={onClose}
      id="message-drawer-overlay"
    >
      <aside
        className="user-messages-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div className="user-messages-drawer-header">
          <div className="user-messages-drawer-header-left">
            <MessageCircle size={16} />
            <div>
              <h2>Message Details</h2>
              <p>Received on {formatDate(item.created_at)}</p>
            </div>
          </div>
          <button
            className="user-messages-drawer-close"
            onClick={onClose}
            aria-label="Close"
            id="drawer-close-btn"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="user-messages-drawer-body">
          {/* Full message */}
          <div className="user-messages-message-box">
            <label>Message Content</label>
            <div className="user-messages-message-content">{item.message}</div>
          </div>

          {/* Meta info */}
          <div className="user-messages-info-card">
            <div className="user-messages-info-row">
              <span className="user-messages-info-label">
                <Hash size={13} /> ID:
              </span>
              <span className="user-messages-info-val" style={{ fontFamily: 'monospace', fontSize: 11.5 }}>
                {item.id}
              </span>
            </div>
            <div className="user-messages-info-row">
              <span className="user-messages-info-label">
                <Globe size={13} /> IP Address:
              </span>
              <span className="user-messages-info-val">{item.ip || '—'}</span>
            </div>
            <div className="user-messages-info-row">
              <span className="user-messages-info-label">
                <Monitor size={13} /> User Agent:
              </span>
              <span
                className="user-messages-info-val"
                style={{ fontSize: 11, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-word' }}
                title={item.browser ?? undefined}
              >
                {item.browser || 'Unknown'}
              </span>
            </div>
            <div className="user-messages-info-row">
              <span className="user-messages-info-label">
                <Clock size={13} /> Received:
              </span>
              <span className="user-messages-info-val">{formatDate(item.created_at)}</span>
            </div>
            {item.updated_at !== item.created_at && (
              <div className="user-messages-info-row">
                <span className="user-messages-info-label">
                  <Clock size={13} /> Updated:
                </span>
                <span className="user-messages-info-val">{formatDate(item.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="user-messages-drawer-footer">
          <button
            className="um-btn-danger"
            onClick={() => { onClose(); onDelete(item); }}
            id="drawer-delete-btn"
          >
            <Trash2 size={13} /> Delete
          </button>
          <button className="um-btn-ghost" onClick={onClose} id="drawer-close-footer-btn">
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UserMessagesPage Component
// ---------------------------------------------------------------------------

function UserMessagesPage() {
  const [items, setItems] = useState<UserMessage[]>([]);
  const [meta, setMeta] = useState<UserMessageListMeta>({
    page: 1,
    limit: 20,
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Active drawer item
  const [selectedItem, setSelectedItem] = useState<UserMessage | null>(null);

  // Delete modal target
  const [deleteTarget, setDeleteTarget] = useState<UserMessage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Global feedback message
  const [globalMsg, setGlobalMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const bodyRef = useRef<HTMLDivElement>(null);

  // ── Fetch Messages ────────────────────────────────────────────────────────

  const fetchMessages = () => {
    setLoading(true);
    setFetchError(null);

    const filters: UserMessageFilters = { page, limit };

    if (search.trim()) {
      filters.search = search.trim();
    }
    if (dateFrom) {
      filters.date_from = dateFrom;
    }
    if (dateTo) {
      filters.date_to = dateTo;
    }

    userMessagesApi
      .list(filters)
      .then((res) => {
        setItems(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
      })
      .catch(() => setFetchError('Failed to load user messages. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, [search, dateFrom, dateTo, page, limit]);

  // ── Feedback flash helper ─────────────────────────────────────────────────

  const flash = (type: 'success' | 'error', text: string) => {
    setGlobalMsg({ type, text });
    setTimeout(() => setGlobalMsg(null), 3500);
  };

  // ── Search handler ────────────────────────────────────────────────────────

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  // ── Date filter handlers ──────────────────────────────────────────────────

  const handleClearDates = () => {
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  // ── Delete Confirm Action ─────────────────────────────────────────────────

  const handleDeleteConfirm = async (permanent: boolean) => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (permanent) {
        await userMessagesApi.forceDelete(deleteTarget.id);
        flash('success', 'Message deleted permanently.');
      } else {
        await userMessagesApi.delete(deleteTarget.id);
        flash('success', 'Message deleted successfully.');
      }

      if (selectedItem?.id === deleteTarget.id) {
        setSelectedItem(null);
      }

      fetchMessages();
    } catch {
      flash('error', 'Could not delete message. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  // ── Active date filter indicator ──────────────────────────────────────────
  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="user-messages-page">
      {/* Page header */}
      <div className="user-messages-page-header">
        <div className="user-messages-page-header-left">
          <h1>
            <MessageCircle size={20} />
            User Messages
          </h1>
          <p>Browse and manage messages submitted by website visitors.</p>
        </div>
        <div>
          <button
            className="um-btn-refresh"
            onClick={fetchMessages}
            title="Refresh list"
            id="refresh-btn"
          >
            <RefreshCw size={14} className={loading ? 'um-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats chips */}
      <div className="user-messages-stats-bar">
        <div className="user-messages-stat-chip">
          <MessageCircle size={13} />
          <span>
            <strong>{meta.total}</strong> Total Messages
          </span>
        </div>
        {hasDateFilter && (
          <div className="user-messages-stat-chip" style={{ borderColor: 'rgba(99,102,241,0.35)', color: 'var(--primary, #6366f1)' }}>
            <CalendarRange size={13} />
            <span>Date filter active</span>
          </div>
        )}
        {search && (
          <div className="user-messages-stat-chip" style={{ borderColor: 'rgba(99,102,241,0.35)', color: 'var(--primary, #6366f1)' }}>
            <Filter size={13} />
            <span>Search: <strong>"{search}"</strong></span>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="user-messages-filters">
        {/* Search box */}
        <form className="user-messages-search-box" onSubmit={handleSearchSubmit} id="search-form">
          <Search size={14} />
          <input
            type="text"
            id="search-input"
            className="user-messages-search-input"
            placeholder="Search by message, IP or browser..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="user-messages-clear-btn"
              onClick={handleClearSearch}
              title="Clear search"
              id="clear-search-btn"
            >
              <X size={12} />
            </button>
          )}
        </form>

        {/* Filters group */}
        <div className="user-messages-filter-group">
          {/* Date from */}
          <label className="user-messages-date-label" htmlFor="date-from-input">
            <CalendarRange size={13} />
            From
          </label>
          <input
            type="date"
            id="date-from-input"
            className="user-messages-date-input"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
          />

          {/* Date to */}
          <label className="user-messages-date-label" htmlFor="date-to-input">
            To
          </label>
          <input
            type="date"
            id="date-to-input"
            className="user-messages-date-input"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
          />

          {/* Clear dates button — shown only when active */}
          {hasDateFilter && (
            <button
              className="user-messages-clear-dates-btn"
              onClick={handleClearDates}
              title="Clear date filters"
              id="clear-dates-btn"
            >
              <RotateCcw size={12} />
              Clear dates
            </button>
          )}

          {/* Per-page selector */}
          <select
            id="per-page-select"
            className="user-messages-select"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* Global feedback notification */}
      {globalMsg && (
        <p className={`user-messages-feedback ${globalMsg.type}`} id="feedback-banner">
          {globalMsg.type === 'success' ? (
            <CheckCircle2 size={13} />
          ) : (
            <AlertCircle size={13} />
          )}
          {globalMsg.text}
        </p>
      )}

      {/* Main content area */}
      <div className="user-messages-content-area" ref={bodyRef}>
        {/* Table column headers */}
        {!loading && !fetchError && items.length > 0 && (
          <div className="user-messages-list-header">
            <span>Message</span>
            <span>IP Address</span>
            <span>Browser</span>
            <span>Received</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>
        )}

        {loading && (
          <div className="user-messages-loading" id="loading-indicator">
            <Loader2 size={18} className="um-spin" />
            Loading user messages…
          </div>
        )}

        {fetchError && !loading && (
          <div className="user-messages-loading error" id="error-indicator">
            <AlertCircle size={16} />
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && (
          <MessageList
            items={items}
            onOpen={(item) => setSelectedItem(item)}
            onDelete={setDeleteTarget}
          />
        )}

        {/* Pagination controls */}
        {!loading && meta.last_page > 1 && (
          <div className="user-messages-pagination" id="pagination">
            <span>
              Showing {items.length} of {meta.total} messages &nbsp;·&nbsp; Page {meta.page} of{' '}
              {meta.last_page}
            </span>
            <div className="user-messages-pagination-controls">
              <button
                className="user-messages-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
                id="prev-page-btn"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                className="user-messages-page-btn"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.page >= meta.last_page}
                id="next-page-btn"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-in detail drawer */}
      {selectedItem && (
        <MessageDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

UserMessagesPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default UserMessagesPage;
