import { useEffect, useRef, useState } from 'react';
import { ReactNode } from 'react';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  LayoutList,
  Plus,
  Pencil,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  GripVertical,
  ExternalLink,
  Link2,
  FolderTree,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import './homeMenu.css';
import { homeMenuApi } from '../../../api/homeMenu.api';
import type { HomeMenu, FormErrors, DrawerMode, MenuFormData} from '../../../types/menus.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
const EMPTY_FORM: MenuFormData = {
  title: '',
  icon: '',
  url: '',
  target: '_self',
  sort_order: 0,
  is_active: true,
  parent_id: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function flattenTree(items: HomeMenu[]): HomeMenu[] {
  const result: HomeMenu[] = [];
  function walk(list: HomeMenu[]) {
    for (const item of list) {
      result.push(item);
      if (item.children?.length) walk(item.children);
    }
  }
  walk(items);
  return result;
}

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`menu-status-badge ${active ? 'active' : 'inactive'}`}>
      {active ? <Eye size={10} /> : <EyeOff size={10} />}
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// TargetBadge
// ---------------------------------------------------------------------------

function TargetBadge({ target }: { target: string }) {
  return target === '_blank' ? (
    <span className="menu-target-badge">
      <ExternalLink size={10} /> New tab
    </span>
  ) : null;
}

// ---------------------------------------------------------------------------
// MenuRow — one row in the list (flat or indented child)
// ---------------------------------------------------------------------------

interface MenuRowProps {
  item: HomeMenu;
  depth: number;
  onEdit: (item: HomeMenu) => void;
  onDelete: (item: HomeMenu) => void;
  onToggleActive: (item: HomeMenu) => void;
}

function MenuRow({ item, depth, onEdit, onDelete, onToggleActive }: MenuRowProps) {
  return (
    <div className={`menu-row ${depth > 0 ? 'menu-row--child' : ''}`} style={{ '--depth': depth } as React.CSSProperties}>
      <span className="menu-row-drag">
        <GripVertical size={14} />
      </span>

      {depth > 0 && (
        <span className="menu-row-indent">
          <ChevronRight size={12} />
        </span>
      )}

      <span className="menu-row-icon">
        {item.icon ? (
          <span className="menu-row-icon-text">{item.icon}</span>
        ) : (
          <Link2 size={13} />
        )}
      </span>

      <span className="menu-row-title">{item.title}</span>

      <span className="menu-row-url">{item.url || <em>No URL</em>}</span>

      <span className="menu-row-meta">
        <StatusBadge active={item.is_active} />
        <TargetBadge target={item.target} />
      </span>

      <span className="menu-row-order">#{item.sort_order}</span>

      <div className="menu-row-actions">
        <button
          className="menu-action-btn"
          title={item.is_active ? 'Deactivate' : 'Activate'}
          onClick={() => onToggleActive(item)}
        >
          {item.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button className="menu-action-btn" title="Edit" onClick={() => onEdit(item)}>
          <Pencil size={13} />
        </button>
        <button className="menu-action-btn danger" title="Delete" onClick={() => onDelete(item)}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MenuList — renders the flat/tree list
// ---------------------------------------------------------------------------

interface MenuListProps {
  items: HomeMenu[];
  onEdit: (item: HomeMenu) => void;
  onDelete: (item: HomeMenu) => void;
  onToggleActive: (item: HomeMenu) => void;
}

function MenuList({ items, onEdit, onDelete, onToggleActive }: MenuListProps) {
  function renderItems(list: HomeMenu[], depth = 0): ReactNode[] {
    return list.flatMap((item) => [
      <MenuRow
        key={item.id}
        item={item}
        depth={depth}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />,
      ...(item.children?.length ? renderItems(item.children, depth + 1) : []),
    ]);
  }

  if (!items.length) {
    return (
      <div className="menu-empty">
        <LayoutList size={32} />
        <p>No menu items yet.</p>
        <span>Click "Add item" to create your first menu entry.</span>
      </div>
    );
  }

  return <div className="menu-list">{renderItems(items)}</div>;
}

// ---------------------------------------------------------------------------
// DeleteConfirmModal
// ---------------------------------------------------------------------------

interface DeleteConfirmProps {
  item: HomeMenu;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteConfirmModal({ item, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <div className="menu-modal-overlay" onClick={onCancel}>
      <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
        <div className="menu-modal-header">
          <Trash2 size={16} />
          <h3>Delete menu item</h3>
        </div>
        <p className="menu-modal-body">
          Are you sure you want to delete <strong>"{item.title}"</strong>?
          {item.children?.length ? (
            <> Its <strong>{item.children.length}</strong> child item(s) will become top-level items.</>
          ) : null}
          {' '}This action cannot be undone.
        </p>
        <div className="menu-modal-footer">
          <button className="btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <><Loader2 size={13} className="spin" /> Deleting…</> : <><Trash2 size={13} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MenuDrawer — slide-in panel for create / edit
// ---------------------------------------------------------------------------

interface MenuDrawerProps {
  mode: DrawerMode;
  form: MenuFormData;
  errors: FormErrors;
  status: 'idle' | 'saving' | 'saved' | 'error';
  allItems: HomeMenu[];         // flat list for parent selector (excluding self on edit)
  editingId: string | null;
  onChange: (field: keyof MenuFormData, value: string | number | boolean) => void;
  onSave: () => void;
  onClose: () => void;
}

function MenuDrawer({
  mode, form, errors, status, allItems, editingId, onChange, onSave, onClose,
}: MenuDrawerProps) {
  const parentOptions = allItems.filter((m) => m.id !== editingId && !m.parent_id);

  return (
    <div className="menu-drawer-overlay" onClick={onClose}>
      <aside className="menu-drawer" onClick={(e) => e.stopPropagation()}>

        {/* Drawer header */}
        <div className="menu-drawer-header">
          <div className="menu-drawer-header-left">
            {mode === 'create' ? <Plus size={16} /> : <Pencil size={16} />}
            <div>
              <h2>{mode === 'create' ? 'Add menu item' : 'Edit menu item'}</h2>
              <p>{mode === 'create' ? 'Fill in the details for the new entry.' : `Editing "${form.title}"`}</p>
            </div>
          </div>
          <button className="menu-drawer-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="menu-drawer-body">

          {status === 'error' && Object.keys(errors).length === 0 && (
            <p className="menu-feedback error">
              <AlertCircle size={13} /> Something went wrong. Please try again.
            </p>
          )}

          {/* Title */}
          <div className="menu-field-group">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              placeholder="e.g. Home, About Us"
              value={form.title}
              onChange={(e) => onChange('title', e.target.value)}
              className={errors.title ? 'field-error' : ''}
            />
            {errors.title && <p className="menu-field-error">{errors.title}</p>}
          </div>

          {/* URL */}
          <div className="menu-field-group">
            <label>URL</label>
            <p className="menu-field-desc">Leave blank for non-linkable parent items.</p>
            <input
              type="text"
              placeholder="e.g. /about or https://example.com"
              value={form.url}
              onChange={(e) => onChange('url', e.target.value)}
              className={errors.url ? 'field-error' : ''}
            />
            {errors.url && <p className="menu-field-error">{errors.url}</p>}
          </div>

          {/* Icon */}
          <div className="menu-field-group">
            <label>Icon</label>
            <p className="menu-field-desc">Icon name or emoji displayed alongside the label.</p>
            <input
              type="text"
              placeholder="e.g. 🏠 or home-icon"
              value={form.icon}
              onChange={(e) => onChange('icon', e.target.value)}
              className={errors.icon ? 'field-error' : ''}
            />
            {errors.icon && <p className="menu-field-error">{errors.icon}</p>}
          </div>

          {/* Target + Sort order — two-column row */}
          <div className="menu-field-row">
            <div className="menu-field-group">
              <label>Open in</label>
              <select
                value={form.target}
                onChange={(e) => onChange('target', e.target.value as '_self' | '_blank')}
              >
                <option value="_self">Same tab</option>
                <option value="_blank">New tab</option>
              </select>
            </div>
            <div className="menu-field-group">
              <label>Sort order</label>
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => onChange('sort_order', Number(e.target.value))}
                className={errors.sort_order ? 'field-error' : ''}
              />
              {errors.sort_order && <p className="menu-field-error">{errors.sort_order}</p>}
            </div>
          </div>

          {/* Parent */}
          <div className="menu-field-group">
            <label>Parent item</label>
            <p className="menu-field-desc">Assign a parent to nest this item one level deep.</p>
            <select
              value={form.parent_id}
              onChange={(e) => onChange('parent_id', e.target.value)}
              className={errors.parent_id ? 'field-error' : ''}
            >
              <option value="">— None (top-level) —</option>
              {parentOptions.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
            {errors.parent_id && <p className="menu-field-error">{errors.parent_id}</p>}
          </div>

          {/* Active toggle */}
          <div className="menu-field-group">
            <label>Visibility</label>
            <div className="menu-toggle-row">
              <label className="menu-toggle">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => onChange('is_active', e.target.checked)}
                />
                <span className="menu-toggle-slider" />
              </label>
              <span className="menu-toggle-label">
                {form.is_active ? 'Active — visible to users' : 'Inactive — hidden from users'}
              </span>
            </div>
          </div>

        </div>

        {/* Drawer footer */}
        <div className="menu-drawer-footer">
          <button className="btn-ghost" onClick={onClose} disabled={status === 'saving'}>
            Cancel
          </button>
          <button
            className={`btn-save ${status === 'saved' ? 'saved' : ''}`}
            onClick={onSave}
            disabled={status === 'saving'}
          >
            {status === 'saving' ? (
              <><Loader2 size={14} className="spin" /> Saving…</>
            ) : status === 'saved' ? (
              <><CheckCircle2 size={14} /> Saved</>
            ) : (
              <><Save size={14} /> {mode === 'create' ? 'Create item' : 'Save changes'}</>
            )}
          </button>
        </div>

      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HomeMenuPage
// ---------------------------------------------------------------------------

function HomeMenuPage() {
  const [items, setItems]               = useState<HomeMenu[]>([]);
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState<string | null>(null);

  // Drawer
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [drawerMode, setDrawerMode]     = useState<DrawerMode>('create');
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [form, setForm]                 = useState<MenuFormData>(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState<FormErrors>({});
  const [saveStatus, setSaveStatus]     = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<HomeMenu | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Global feedback (top of list)
  const [globalMsg, setGlobalMsg]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const bodyRef                         = useRef<HTMLDivElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchMenus = () => {
    setLoading(true);
    homeMenuApi
      .index()
      .then((res) => setItems(res.data.data as HomeMenu[]))
      .catch(() => setFetchError('Failed to load menu items. Please refresh.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMenus(); }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const flash = (type: 'success' | 'error', text: string) => {
    setGlobalMsg({ type, text });
    setTimeout(() => setGlobalMsg(null), 3000);
  };

  const flatItems = flattenTree(items);

  // ── Drawer open/close ────────────────────────────────────────────────────

  const openCreate = () => {
    setDrawerMode('create');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSaveStatus('idle');
    setDrawerOpen(true);
  };

  const openEdit = (item: HomeMenu) => {
    setDrawerMode('edit');
    setEditingId(item.id);
    setForm({
      title:      item.title,
      icon:       item.icon ?? '',
      url:        item.url ?? '',
      target:     item.target,
      sort_order: item.sort_order,
      is_active:  item.is_active,
      parent_id:  item.parent_id ?? '',
    });
    setFormErrors({});
    setSaveStatus('idle');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSaveStatus('idle');
  };

  // ── Form field change ────────────────────────────────────────────────────

  const handleFormChange = (field: keyof MenuFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── Save (create or update) ──────────────────────────────────────────────

  const handleSave = async () => {
    setSaveStatus('saving');
    setFormErrors({});

    const payload = {
      title:      form.title,
      icon:       form.icon || null,
      url:        form.url || null,
      target:     form.target,
      sort_order: form.sort_order,
      is_active:  form.is_active,
      parent_id:  form.parent_id || null,
    };

    try {
      if (drawerMode === 'create') {
        await homeMenuApi.store(payload);
        flash('success', 'Menu item created successfully.');
      } else {
        await homeMenuApi.update(editingId!, payload);
        flash('success', 'Menu item updated successfully.');
      }
      setSaveStatus('saved');
      fetchMenus();
      setTimeout(() => {
        setSaveStatus('idle');
        closeDrawer();
      }, 900);
    } catch (err: unknown) {
      setSaveStatus('error');
      if (err && typeof err === 'object' && 'errors' in err) {
        setFormErrors(err.errors as FormErrors);
      }
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await homeMenuApi.destroy(deleteTarget.id);
      flash('success', `"${deleteTarget.title}" deleted.`);
      fetchMenus();
    } catch {
      flash('error', 'Could not delete item. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  // ── Toggle active ────────────────────────────────────────────────────────

  const handleToggleActive = async (item: HomeMenu) => {
    try {
      await homeMenuApi.update(item.id, { is_active: !item.is_active });
      flash('success', `"${item.title}" ${!item.is_active ? 'activated' : 'deactivated'}.`);
      fetchMenus();
    } catch {
      flash('error', 'Could not update item. Please try again.');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const topLevelCount   = items.filter((m) => !m.parent_id).length;
  const activeCount     = flatItems.filter((m) => m.is_active).length;
  const totalCount      = flatItems.length;

  return (
    <div className="menu-page">

      {/* Page header */}
      <div className="menu-page-header">
        <div className="menu-page-header-left">
          <h1>
            <LayoutList size={20} />
            Home Menus
          </h1>
          <p>Manage navigation items displayed in the home screen. Drag to reorder, nest to create sub-menus.</p>
        </div>
        <button className="btn-add" onClick={openCreate}>
          <Plus size={14} />
          Add item
        </button>
      </div>

      {/* Stats bar */}
      <div className="menu-stats-bar">
        <div className="menu-stat">
          <FolderTree size={13} />
          <span><strong>{topLevelCount}</strong> top-level</span>
        </div>
        <div className="menu-stat">
          <Eye size={13} />
          <span><strong>{activeCount}</strong> active</span>
        </div>
        <div className="menu-stat">
          <LayoutList size={13} />
          <span><strong>{totalCount}</strong> total</span>
        </div>
      </div>

      {/* Global feedback */}
      {globalMsg && (
        <p className={`menu-feedback ${globalMsg.type}`}>
          {globalMsg.type === 'success'
            ? <CheckCircle2 size={13} />
            : <AlertCircle size={13} />}
          {globalMsg.text}
        </p>
      )}

      {/* Main content area */}
      <div className="menu-content-area" ref={bodyRef}>

        {/* Column headings */}
        {!loading && !fetchError && items.length > 0 && (
          <div className="menu-list-header">
            <span className="col-title">Title</span>
            <span className="col-url">URL</span>
            <span className="col-meta">Status</span>
            <span className="col-order">Order</span>
            <span className="col-actions">Actions</span>
          </div>
        )}

        {loading && (
          <div className="menu-loading">
            <Loader2 size={18} className="spin" />
            Loading menu items…
          </div>
        )}

        {fetchError && !loading && (
          <div className="menu-loading error">
            <AlertCircle size={16} />
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && (
          <MenuList
            items={items}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <MenuDrawer
          mode={drawerMode}
          form={form}
          errors={formErrors}
          status={saveStatus}
          allItems={flatItems}
          editingId={editingId}
          onChange={handleFormChange}
          onSave={handleSave}
          onClose={closeDrawer}
        />
      )}

      {/* Delete modal */}
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

HomeMenuPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default HomeMenuPage;