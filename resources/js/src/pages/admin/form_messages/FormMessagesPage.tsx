import { useEffect, useRef, useState, ReactNode } from 'react';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  MessageSquare,
  Mail,
  Phone,
  User,
  Search,
  Trash2,
  Archive,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Send,
  RefreshCw,
  Inbox,
  X,
  Clock,
  Tag,
  RotateCcw,
} from 'lucide-react';
import './formMessages.css';
import {
  formMessagesApi,
  FormMessage,
  FormMessageStatus,
  FormMessageCounts,
  FormMessageListMeta,
  FormMessageFilters,
} from '../../../api/form_messages_api';

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

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: FormMessageStatus }) {
  const configs: Record<FormMessageStatus, { label: string; icon: ReactNode }> = {
    new: { label: 'New', icon: <Inbox size={10} /> },
    read: { label: 'Read', icon: <Eye size={10} /> },
    replied: { label: 'Replied', icon: <CheckCircle2 size={10} /> },
    archived: { label: 'Archived', icon: <Archive size={10} /> },
    spam: { label: 'Spam', icon: <ShieldAlert size={10} /> },
  };

  const config = configs[status] || { label: status, icon: null };

  return (
    <span className={`form-messages-status-badge ${status}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// MessageRow — single row in the table list
// ---------------------------------------------------------------------------

interface MessageRowProps {
  item: FormMessage;
  onOpen: (item: FormMessage) => void;
  onDelete: (item: FormMessage) => void;
  onStatusChange: (item: FormMessage, status: FormMessageStatus) => void;
}

function MessageRow({ item, onOpen, onDelete, onStatusChange }: MessageRowProps) {
  const isUnread = item.status === 'new';

  return (
    <div
      className={`form-messages-row ${isUnread ? 'is-unread' : ''}`}
      onClick={() => onOpen(item)}
    >
      {/* Sender */}
      <div className="form-messages-row-sender">
        <span className="form-messages-row-sender-name">{item.name}</span>
        <span className="form-messages-row-sender-email">{item.email}</span>
      </div>

      {/* Subject & Preview */}
      <div className="form-messages-row-subject">
        <span className="form-messages-row-subject-title">
          {item.subject || '(No Subject)'}
        </span>
        <span className="form-messages-row-subject-preview">{item.message}</span>
      </div>

      {/* Form Key */}
      <div>
        <span className="form-messages-row-formkey">
          <Tag size={10} /> {item.form_key || 'contact'}
        </span>
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={item.status} />
      </div>

      {/* Date */}
      <div className="form-messages-row-date">{formatDate(item.created_at)}</div>

      {/* Actions */}
      <div className="form-messages-row-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="form-messages-action-btn primary"
          title="View & Reply"
          onClick={() => onOpen(item)}
        >
          <Eye size={13} />
        </button>

        {item.status !== 'archived' ? (
          <button
            className="form-messages-action-btn"
            title="Archive"
            onClick={() => onStatusChange(item, 'archived')}
          >
            <Archive size={13} />
          </button>
        ) : (
          <button
            className="form-messages-action-btn"
            title="Restore to Read"
            onClick={() => onStatusChange(item, 'read')}
          >
            <RotateCcw size={13} />
          </button>
        )}

        <button
          className="form-messages-action-btn danger"
          title="Delete"
          onClick={() => onDelete(item)}
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
  items: FormMessage[];
  onOpen: (item: FormMessage) => void;
  onDelete: (item: FormMessage) => void;
  onStatusChange: (item: FormMessage, status: FormMessageStatus) => void;
}

function MessageList({ items, onOpen, onDelete, onStatusChange }: MessageListProps) {
  if (!items.length) {
    return (
      <div className="form-messages-empty">
        <MessageSquare size={32} />
        <p>No messages found.</p>
        <span>No form submissions match the selected filter or search query.</span>
      </div>
    );
  }

  return (
    <div className="form-messages-list">
      {items.map((item) => (
        <MessageRow
          key={item.id}
          item={item}
          onOpen={onOpen}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DeleteConfirmModal
// ---------------------------------------------------------------------------

interface DeleteConfirmProps {
  item: FormMessage;
  onConfirm: (permanent: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmModal({ item, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  const [permanent, setPermanent] = useState(false);

  return (
    <div className="form-messages-modal-overlay" onClick={onCancel}>
      <div className="form-messages-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-messages-modal-header">
          <Trash2 size={16} />
          <h3>Delete form message</h3>
        </div>
        <div className="form-messages-modal-body">
          <p>
            Are you sure you want to delete message from <strong>"{item.name}"</strong> ({item.email})?
          </p>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={permanent}
                onChange={(e) => setPermanent(e.target.checked)}
              />
              <span>Delete permanently (cannot be restored)</span>
            </label>
          </div>
        </div>
        <div className="form-messages-modal-footer">
          <button className="btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={() => onConfirm(permanent)} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={13} className="spin" /> Deleting…
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
// MessageDrawer — slide-in panel for view & reply
// ---------------------------------------------------------------------------

interface MessageDrawerProps {
  item: FormMessage;
  onClose: () => void;
  onSendReply: (id: string, replyText: string) => Promise<void>;
  onStatusChange: (id: string, status: FormMessageStatus) => Promise<void>;
}

function MessageDrawer({ item, onClose, onSendReply, onStatusChange }: MessageDrawerProps) {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<FormMessageStatus | null>(null);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    setErrorMsg(null);
    try {
      await onSendReply(item.id, replyText.trim());
      setReplySuccess(true);
      setReplyText('');
      setTimeout(() => setReplySuccess(false), 3000);
    } catch {
      setErrorMsg('Failed to send reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleStatusClick = async (status: FormMessageStatus) => {
    setUpdatingStatus(status);
    try {
      await onStatusChange(item.id, status);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="form-messages-drawer-overlay" onClick={onClose}>
      <aside className="form-messages-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer header */}
        <div className="form-messages-drawer-header">
          <div className="form-messages-drawer-header-left">
            <Mail size={16} />
            <div>
              <h2>Message Details</h2>
              <p>Submitted on {formatDate(item.created_at)}</p>
            </div>
          </div>
          <button className="form-messages-drawer-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="form-messages-drawer-body">
          {errorMsg && (
            <p className="form-messages-feedback error">
              <AlertCircle size={13} /> {errorMsg}
            </p>
          )}

          {replySuccess && (
            <p className="form-messages-feedback success">
              <CheckCircle2 size={13} /> Reply sent successfully!
            </p>
          )}

          {/* Sender & Meta details card */}
          <div className="form-messages-info-card">
            <div className="form-messages-info-row">
              <span className="form-messages-info-label">
                <User size={13} /> Name:
              </span>
              <span className="form-messages-info-val">{item.name}</span>
            </div>
            <div className="form-messages-info-row">
              <span className="form-messages-info-label">
                <Mail size={13} /> Email:
              </span>
              <span className="form-messages-info-val">{item.email}</span>
            </div>
            {item.phone && (
              <div className="form-messages-info-row">
                <span className="form-messages-info-label">
                  <Phone size={13} /> Phone:
                </span>
                <span className="form-messages-info-val">{item.phone}</span>
              </div>
            )}
            <div className="form-messages-info-row">
              <span className="form-messages-info-label">
                <Tag size={13} /> Form Key:
              </span>
              <span className="form-messages-row-formkey">{item.form_key || 'contact'}</span>
            </div>
            <div className="form-messages-info-row">
              <span className="form-messages-info-label">
                <Clock size={13} /> Status:
              </span>
              <StatusBadge status={item.status} />
            </div>
          </div>

          {/* Subject & Message body */}
          <div className="form-messages-body-box">
            <label>Subject</label>
            <h3 className="form-messages-subject-text">{item.subject || '(No Subject)'}</h3>
            <label style={{ marginTop: 8 }}>Message Content</label>
            <div className="form-messages-content-text">{item.message}</div>
          </div>

          {/* Existing reply if available */}
          {item.reply && (
            <div className="form-messages-reply-existing">
              <div className="form-messages-reply-header">
                <span>
                  <CheckCircle2 size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Replied {item.replied_at ? `on ${formatDate(item.replied_at)}` : ''}
                </span>
                {item.handler?.name && <span>By {item.handler.name}</span>}
              </div>
              <div className="form-messages-reply-content">{item.reply}</div>
            </div>
          )}

          {/* Send reply form */}
          <div className="form-messages-reply-form">
            <label>
              <Send size={13} /> {item.reply ? 'Send Another Reply' : 'Reply to Sender'}
            </label>
            <textarea
              className="form-messages-reply-textarea"
              placeholder={`Write your response to ${item.email}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                className="btn-save"
                onClick={handleReplySubmit}
                disabled={sending || !replyText.trim()}
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} /> Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Drawer footer — Quick Status Actions */}
        <div className="form-messages-drawer-footer">
          <div className="form-messages-drawer-footer-actions">
            {item.status !== 'read' && (
              <button
                className="btn-ghost"
                onClick={() => handleStatusClick('read')}
                disabled={updatingStatus !== null}
              >
                {updatingStatus === 'read' ? <Loader2 size={13} className="spin" /> : <Eye size={13} />}
                Mark as Read
              </button>
            )}
            {item.status !== 'archived' ? (
              <button
                className="btn-ghost"
                onClick={() => handleStatusClick('archived')}
                disabled={updatingStatus !== null}
              >
                {updatingStatus === 'archived' ? <Loader2 size={13} className="spin" /> : <Archive size={13} />}
                Archive
              </button>
            ) : (
              <button
                className="btn-ghost"
                onClick={() => handleStatusClick('read')}
                disabled={updatingStatus !== null}
              >
                {updatingStatus === 'read' ? <Loader2 size={13} className="spin" /> : <RotateCcw size={13} />}
                Restore
              </button>
            )}
            {item.status !== 'spam' && (
              <button
                className="btn-ghost"
                onClick={() => handleStatusClick('spam')}
                disabled={updatingStatus !== null}
              >
                {updatingStatus === 'spam' ? <Loader2 size={13} className="spin" /> : <ShieldAlert size={13} />}
                Spam
              </button>
            )}
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
// FormMessagesPage Component
// ---------------------------------------------------------------------------

function FormMessagesPage() {
  const [items, setItems] = useState<FormMessage[]>([]);
  const [meta, setMeta] = useState<FormMessageListMeta>({ page: 1, limit: 15, total: 0, last_page: 1 });
  const [counts, setCounts] = useState<FormMessageCounts>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<FormMessageStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [formKeyFilter, setFormKeyFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  // Active drawer item
  const [selectedItem, setSelectedItem] = useState<FormMessage | null>(null);

  // Delete modal target
  const [deleteTarget, setDeleteTarget] = useState<FormMessage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Global feedback message
  const [globalMsg, setGlobalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // ── Fetch Messages ────────────────────────────────────────────────────────

  const fetchMessages = () => {
    setLoading(true);
    setFetchError(null);

    const filters: FormMessageFilters = {
      page,
      limit,
    };

    if (statusFilter !== 'all') {
      filters.status = statusFilter;
    }
    if (search.trim()) {
      filters.search = search.trim();
    }
    if (formKeyFilter.trim()) {
      filters.form_key = formKeyFilter.trim();
    }

    formMessagesApi
      .list(filters)
      .then((res) => {
        setItems(res.data.data || []);
        if (res.data.meta) setMeta(res.data.meta);
        if (res.data.counts) setCounts(res.data.counts);
      })
      .catch(() => setFetchError('Failed to load form messages. Please try again.'))
      .finally(() => setLoading(false));
  };

  const fetchStats = () => {
    formMessagesApi
      .stats()
      .then((res) => {
        if (res.data.data?.counts) {
          setCounts(res.data.data.counts);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [statusFilter, search, formKeyFilter, page, limit]);

  // ── Feedback flash helper ──────────────────────────────────────────────────

  const flash = (type: 'success' | 'error', text: string) => {
    setGlobalMsg({ type, text });
    setTimeout(() => setGlobalMsg(null), 3000);
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

  // ── Status Change Action ──────────────────────────────────────────────────

  const handleStatusChange = async (item: FormMessage, newStatus: FormMessageStatus) => {
    try {
      const res = await formMessagesApi.updateStatus(item.id, newStatus);
      flash('success', `Message status updated to ${newStatus}.`);

      // Update in local state
      setItems((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: newStatus } : m))
      );

      if (selectedItem?.id === item.id && res.data.data) {
        setSelectedItem(res.data.data);
      }

      fetchStats();
    } catch {
      flash('error', 'Could not update status. Please try again.');
    }
  };

  // ── Reply Action ──────────────────────────────────────────────────────────

  const handleSendReply = async (id: string, replyText: string) => {
    const res = await formMessagesApi.reply(id, replyText);
    flash('success', 'Reply sent successfully.');

    // Update in local state
    if (res.data.data) {
      const updated = res.data.data;
      setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selectedItem?.id === id) {
        setSelectedItem(updated);
      }
    }
    fetchStats();
  };

  // ── Delete Confirm Action ─────────────────────────────────────────────────

  const handleDeleteConfirm = async (permanent: boolean) => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (permanent) {
        await formMessagesApi.forceDelete(deleteTarget.id);
        flash('success', `Message from "${deleteTarget.name}" deleted permanently.`);
      } else {
        await formMessagesApi.delete(deleteTarget.id);
        flash('success', `Message from "${deleteTarget.name}" deleted.`);
      }

      if (selectedItem?.id === deleteTarget.id) {
        setSelectedItem(null);
      }

      fetchMessages();
      fetchStats();
    } catch {
      flash('error', 'Could not delete message. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  // ── Render Total Counts ───────────────────────────────────────────────────

  const totalCount = (counts.new || 0) + (counts.read || 0) + (counts.replied || 0) + (counts.archived || 0) + (counts.spam || 0);

  return (
    <div className="form-messages-page">
      {/* Page header */}
      <div className="form-messages-page-header">
        <div className="form-messages-page-header-left">
          <h1>
            <MessageSquare size={20} />
            Form Messages
          </h1>
          <p>View, respond to, and manage form submissions and contact inquiries.</p>
        </div>
        <div>
          <button className="btn-ghost" onClick={() => { fetchMessages(); fetchStats(); }} title="Refresh list">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats bar / Quick Status Filters */}
      <div className="form-messages-stats-bar">
        <button
          className={`form-messages-stat ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('all'); setPage(1); }}
        >
          <Inbox size={13} />
          <span>
            <strong>{totalCount}</strong> All
          </span>
        </button>

        <button
          className={`form-messages-stat ${statusFilter === 'new' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('new'); setPage(1); }}
        >
          <AlertCircle size={13} />
          <span>
            <strong>{counts.new || 0}</strong> New
          </span>
        </button>

        <button
          className={`form-messages-stat ${statusFilter === 'read' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('read'); setPage(1); }}
        >
          <Eye size={13} />
          <span>
            <strong>{counts.read || 0}</strong> Read
          </span>
        </button>

        <button
          className={`form-messages-stat ${statusFilter === 'replied' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('replied'); setPage(1); }}
        >
          <CheckCircle2 size={13} />
          <span>
            <strong>{counts.replied || 0}</strong> Replied
          </span>
        </button>

        <button
          className={`form-messages-stat ${statusFilter === 'archived' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('archived'); setPage(1); }}
        >
          <Archive size={13} />
          <span>
            <strong>{counts.archived || 0}</strong> Archived
          </span>
        </button>

        <button
          className={`form-messages-stat ${statusFilter === 'spam' ? 'active' : ''}`}
          onClick={() => { setStatusFilter('spam'); setPage(1); }}
        >
          <ShieldAlert size={13} />
          <span>
            <strong>{counts.spam || 0}</strong> Spam
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="form-messages-filters">
        <form className="form-messages-search-box" onSubmit={handleSearchSubmit}>
          <Search size={14} />
          <input
            type="text"
            className="form-messages-search-input"
            placeholder="Search by name, email, subject or content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="form-messages-clear-btn"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </form>

        <div className="form-messages-filter-group">
          <input
            type="text"
            className="form-messages-select"
            placeholder="Form key filter..."
            value={formKeyFilter}
            onChange={(e) => {
              setFormKeyFilter(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="form-messages-select"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Global feedback notification */}
      {globalMsg && (
        <p className={`form-messages-feedback ${globalMsg.type}`}>
          {globalMsg.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          {globalMsg.text}
        </p>
      )}

      {/* Main content area */}
      <div className="form-messages-content-area" ref={bodyRef}>
        {/* Table column headers */}
        {!loading && !fetchError && items.length > 0 && (
          <div className="form-messages-list-header">
            <span>Sender</span>
            <span>Subject & Message</span>
            <span>Form</span>
            <span>Status</span>
            <span>Date</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>
        )}

        {loading && (
          <div className="form-messages-loading">
            <Loader2 size={18} className="spin" />
            Loading form messages…
          </div>
        )}

        {fetchError && !loading && (
          <div className="form-messages-loading error">
            <AlertCircle size={16} />
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && (
          <MessageList
            items={items}
            onOpen={(item) => {
              setSelectedItem(item);
              if (item.status === 'new') {
                handleStatusChange(item, 'read');
              }
            }}
            onDelete={setDeleteTarget}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Pagination controls */}
        {!loading && meta.last_page > 1 && (
          <div className="form-messages-pagination">
            <span>
              Showing {items.length} of {meta.total} messages (Page {meta.page} of {meta.last_page})
            </span>
            <div className="form-messages-pagination-controls">
              <button
                className="form-messages-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                className="form-messages-page-btn"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.page >= meta.last_page}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-in detail & reply drawer */}
      {selectedItem && (
        <MessageDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSendReply={handleSendReply}
          onStatusChange={async (id, status) => {
            const target = items.find((m) => m.id === id) || selectedItem;
            await handleStatusChange(target, status);
          }}
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

FormMessagesPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default FormMessagesPage;
