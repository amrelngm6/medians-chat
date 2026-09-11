import { ReactNode, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Pencil,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Mail,
  Lock,
  UserPlus,
  Filter,
} from 'lucide-react';
import { usersApi } from '../../../api/users.api';
import type { User } from '../../../types';
import { useAuthStore } from '../../../store/auth.store';
import { AppLayout } from '@/components/Layout/AppLayout';
import './users.css';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers & Formatting
// ─────────────────────────────────────────────────────────────────────────────

function getUserInitials(user: User): string {
  const f = user.first_name?.trim() ? user.first_name.trim()[0] : '';
  const l = user.last_name?.trim() ? user.last_name.trim()[0] : '';
  if (f || l) return (f + l).toUpperCase();
  return user.email ? user.email[0].toUpperCase() : 'U';
}

function formatDate(dateVal: Date | string | null): string {
  if (!dateVal) return '—';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Types
// ─────────────────────────────────────────────────────────────────────────────

interface CreateFormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  parent_id: string;
}

interface EditFormState {
  first_name: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
}

const defaultCreateForm = (): CreateFormState => ({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  parent_id: '',
});

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function UsersPage() {
  const qc = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  // ── Search & Filter State ───────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // ── Global Feedback Banner ──────────────────────────────────────────────────
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ── Create Modal State ──────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(defaultCreateForm());
  const [createError, setCreateError] = useState('');

  // ── Edit Modal State ────────────────────────────────────────────────────────
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    first_name: '',
    email: '',
    password: '',
    status: 'active',
  });
  const [editError, setEditError] = useState('');

  // ── Delete Confirm Modal State ──────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // ── Queries & Mutations ─────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
  });

  const usersList: User[] = useMemo(() => data?.data?.users ?? [], [data]);

  // Derive Stats
  const totalCount = usersList.length;
  const activeCount = usersList.filter((u) => u.status === 'active' || u.is_active).length;
  const inactiveCount = totalCount - activeCount;

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      // Status filter
      if (statusFilter === 'active' && u.status !== 'active' && !u.is_active) return false;
      if (statusFilter === 'inactive' && (u.status === 'active' || u.is_active)) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const fullName = `${u.first_name ?? ''} ${u.last_name ?? ''}`.toLowerCase();
        const email = (u.email ?? '').toLowerCase();
        const id = (u.id ?? '').toLowerCase();
        return fullName.includes(q) || email.includes(q) || id.includes(q);
      }

      return true;
    });
  }, [usersList, statusFilter, search]);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: () => usersApi.create(createForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setCreateOpen(false);
      setCreateForm(defaultCreateForm());
      setCreateError('');
      showFeedback('success', 'User account created successfully.');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create user.';
      setCreateError(msg);
    },
  });

  // Edit/Update Mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editTarget) return;

      // 1. Update basic info & status
      await usersApi.update(editTarget.id, {
        first_name: editForm.first_name,
        email: editForm.email,
        status: editForm.status,
      });

      // 2. Reset password if provided
      if (editForm.password.trim()) {
        await usersApi.resetPassword(editTarget.id, editForm.password.trim());
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      closeEdit();
      showFeedback('success', 'User account updated successfully.');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update user.';
      setEditError(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setDeleteTarget(null);
      showFeedback('success', 'User account deleted successfully.');
    },
    onError: () => {
      setDeleteTarget(null);
      showFeedback('error', 'Could not delete user account.');
    },
  });

  // Handlers
  const openEdit = (u: User) => {
    setEditTarget(u);
    setEditForm({
      first_name: u.first_name ?? '',
      email: u.email,
      password: '',
      status: u.status === 'active' || u.is_active ? 'active' : 'inactive',
    });
    setEditError('');
  };

  const closeEdit = () => {
    setEditTarget(null);
    setEditForm({ first_name: '', email: '', password: '', status: 'active' });
    setEditError('');
  };

  return (
    <div className="users-page">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="users-page-header">
        <div className="users-page-header-left">
          <h1>
            <Users size={24} />
            Users & Team
          </h1>
          <p>Manage system accounts, user access, and team member permissions.</p>
        </div>

        <div className="users-header-actions">
          <button
            className="users-btn-refresh"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh user list"
            id="refresh-users-btn"
          >
            <RefreshCw size={13} className={isFetching ? 'users-spin' : ''} />
            Refresh
          </button>

          <button
            className="users-btn-primary"
            onClick={() => {
              setCreateError('');
              setCreateForm(defaultCreateForm());
              setCreateOpen(true);
            }}
            id="create-user-btn"
          >
            <Plus size={16} />
            New User
          </button>
        </div>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <div className="users-stats-bar">
        <div className="users-stat-chip">
          <Users size={14} />
          <span>
            <strong>{totalCount}</strong> Total Users
          </span>
        </div>

        <div className="users-stat-chip users-stat-chip--active">
          <UserCheck size={14} />
          <span>
            <strong>{activeCount}</strong> Active
          </span>
        </div>

        <div className="users-stat-chip users-stat-chip--inactive">
          <UserX size={14} />
          <span>
            <strong>{inactiveCount}</strong> Inactive
          </span>
        </div>

        {search && (
          <div className="users-stat-chip">
            <Filter size={13} />
            <span>
              Search: <strong>"{search}"</strong>
            </span>
          </div>
        )}
      </div>

      {/* ── Filter / Search Controls ──────────────────────────────────────── */}
      <div className="users-filters">
        <div className="users-search-box">
          <Search size={15} />
          <input
            type="text"
            className="users-search-input"
            placeholder="Search by name, email, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="users-search-input"
          />
          {search && (
            <button
              className="users-clear-btn"
              onClick={() => setSearch('')}
              title="Clear search"
              id="clear-users-search-btn"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="users-filter-group">
          <select
            className="users-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            id="status-filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* ── Feedback Notification Banner ──────────────────────────────────── */}
      {feedback && (
        <div className={`users-feedback ${feedback.type}`} id="users-feedback-banner">
          {feedback.type === 'success' ? (
            <CheckCircle2 size={15} />
          ) : (
            <AlertCircle size={15} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ── Main Table Content Area ───────────────────────────────────────── */}
      <div className="users-content-area">
        {/* Loading state */}
        {isLoading && (
          <div className="users-state-box" id="users-loading-state">
            <Loader2 size={24} className="users-spin" />
            <span>Loading user accounts…</span>
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="users-state-box" style={{ color: '#dc2626' }} id="users-error-state">
            <AlertCircle size={24} />
            <span>Failed to load user accounts.</span>
            <button className="users-btn-refresh" onClick={() => refetch()}>
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* User Table Header */}
        {!isLoading && !isError && filteredUsers.length > 0 && (
          <div className="users-list-header">
            <span>User</span>
            <span>Email</span>
            <span>Status</span>
            <span>Parent ID</span>
            <span>Joined Date</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
          </div>
        )}

        {/* User Rows */}
        {!isLoading && !isError && (
          <div className="users-list">
            {filteredUsers.length === 0 ? (
              <div className="users-state-box" id="users-empty-state">
                <Users size={36} className="users-empty-icon" />
                <p style={{ fontWeight: 700, color: 'var(--text-dark, #111827)', margin: 0 }}>
                  No users found
                </p>
                <span style={{ fontSize: 13 }}>
                  No user accounts match the selected filter or search query.
                </span>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                const isActive = u.status === 'active' || u.is_active;

                return (
                  <div key={u.id} className="users-row" id={`user-row-${u.id}`}>
                    {/* User Identity */}
                    <div className="users-cell-user">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt={u.first_name ?? 'User'}
                          className="users-avatar-img"
                        />
                      ) : (
                        <div className="users-avatar">{getUserInitials(u)}</div>
                      )}
                      <div className="users-user-info">
                        <div className="users-name-wrap">
                          <span className="users-name">
                            {u.first_name || u.last_name
                              ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
                              : 'Unnamed User'}
                          </span>
                          {isCurrent && <span className="users-you-badge">You</span>}
                        </div>
                        <span className="users-id-sub">ID: {u.id.slice(0, 8)}…</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="users-cell-email">
                      <Mail size={13} />
                      <span title={u.email}>{u.email}</span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`users-status-badge ${isActive ? 'active' : 'inactive'}`}>
                        <span className="users-status-dot" />
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Parent User / Role */}
                    <div>
                      {(u as unknown as { parent_id?: string }).parent_id ? (
                        <span className="users-parent-tag">
                          {(u as unknown as { parent_id?: string }).parent_id}
                        </span>
                      ) : (
                        <span className="users-parent-empty">—</span>
                      )}
                    </div>

                    {/* Joined Date */}
                    <div className="users-cell-date">{formatDate(u.created_at)}</div>

                    {/* Actions */}
                    <div className="users-row-actions">
                      <button
                        className="users-action-btn edit"
                        onClick={() => openEdit(u)}
                        title="Edit User"
                        id={`edit-user-${u.id}`}
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        className="users-action-btn danger"
                        onClick={() => setDeleteTarget(u)}
                        disabled={isCurrent}
                        title={isCurrent ? "You cannot delete your own account" : "Delete User"}
                        id={`delete-user-${u.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── Create User Modal ─────────────────────────────────────────────── */}
      {createOpen && (
        <div
          className="users-modal-overlay"
          onClick={() => setCreateOpen(false)}
          id="create-modal-overlay"
        >
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="users-modal-header">
              <div className="users-modal-header-left">
                <UserPlus size={18} />
                <h3>Create New User</h3>
              </div>
              <button
                className="users-modal-close"
                onClick={() => setCreateOpen(false)}
                id="create-modal-close-btn"
              >
                <X size={15} />
              </button>
            </div>

            <div className="users-modal-body">
              {createError && (
                <div className="users-feedback error">
                  <AlertCircle size={14} />
                  <span>{createError}</span>
                </div>
              )}

              <div className="users-form-group">
                <label htmlFor="create-first-name">First Name</label>
                <input
                  type="text"
                  id="create-first-name"
                  className="users-form-input"
                  placeholder="e.g. John"
                  value={createForm.first_name}
                  onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="create-last-name">Last Name</label>
                <input
                  type="text"
                  id="create-last-name"
                  className="users-form-input"
                  placeholder="e.g. Doe"
                  value={createForm.last_name}
                  onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="create-email">Email Address *</label>
                <input
                  type="email"
                  id="create-email"
                  className="users-form-input"
                  placeholder="john@example.com"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="create-password">Password *</label>
                <input
                  type="password"
                  id="create-password"
                  className="users-form-input"
                  placeholder="Minimum 6 characters"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                />
              </div>
            </div>

            <div className="users-modal-footer">
              <button
                className="users-btn-ghost"
                onClick={() => setCreateOpen(false)}
                id="create-cancel-btn"
              >
                Cancel
              </button>
              <button
                className="users-btn-primary"
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !createForm.email || !createForm.password}
                id="create-submit-btn"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="users-spin" /> Creating…
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Create Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ───────────────────────────────────────────────── */}
      {editTarget && (
        <div
          className="users-modal-overlay"
          onClick={closeEdit}
          id="edit-modal-overlay"
        >
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="users-modal-header">
              <div className="users-modal-header-left">
                <Pencil size={18} />
                <h3>Edit User — {editTarget.first_name || editTarget.email}</h3>
              </div>
              <button className="users-modal-close" onClick={closeEdit} id="edit-modal-close-btn">
                <X size={15} />
              </button>
            </div>

            <div className="users-modal-body">
              {editError && (
                <div className="users-feedback error">
                  <AlertCircle size={14} />
                  <span>{editError}</span>
                </div>
              )}

              <div className="users-form-group">
                <label htmlFor="edit-first-name">First Name</label>
                <input
                  type="text"
                  id="edit-first-name"
                  className="users-form-input"
                  placeholder="First Name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="edit-email">Email Address</label>
                <input
                  type="email"
                  id="edit-email"
                  className="users-form-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="edit-password">
                  <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  id="edit-password"
                  className="users-form-input"
                  placeholder="Leave blank to keep current password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </div>

              {editTarget.id !== currentUser?.id && (
                <div className="users-form-group">
                  <label htmlFor="edit-status">Account Status</label>
                  <select
                    id="edit-status"
                    className="users-form-select"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>

            <div className="users-modal-footer">
              <button className="users-btn-ghost" onClick={closeEdit} id="edit-cancel-btn">
                Cancel
              </button>
              <button
                className="users-btn-primary"
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                id="edit-save-btn"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="users-spin" /> Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="users-modal-overlay"
          onClick={() => setDeleteTarget(null)}
          id="delete-modal-overlay"
        >
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="users-modal-header">
              <div className="users-modal-header-left">
                <Trash2 size={18} style={{ color: '#dc2626' }} />
                <h3 style={{ color: '#dc2626' }}>Delete User Account</h3>
              </div>
              <button
                className="users-modal-close"
                onClick={() => setDeleteTarget(null)}
                id="delete-modal-close-btn"
              >
                <X size={15} />
              </button>
            </div>

            <div className="users-modal-body">
              <p style={{ fontSize: 14, color: 'var(--text-dark, #111827)', margin: 0 }}>
                Are you sure you want to delete the user account for{' '}
                <strong>
                  {deleteTarget.first_name || deleteTarget.last_name
                    ? `${deleteTarget.first_name ?? ''} ${deleteTarget.last_name ?? ''}`.trim()
                    : deleteTarget.email}
                </strong>
                ?
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted, #6b7280)', margin: 0 }}>
                This action cannot be undone and will permanently remove this account from the system.
              </p>
            </div>

            <div className="users-modal-footer">
              <button
                className="users-btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
                id="delete-cancel-btn"
              >
                Cancel
              </button>
              <button
                className="users-btn-danger"
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                id="delete-confirm-btn"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="users-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UsersPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default UsersPage;
