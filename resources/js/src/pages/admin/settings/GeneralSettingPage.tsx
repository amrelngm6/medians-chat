import { useEffect, useRef, useState } from 'react';
import { ReactNode } from 'react';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings2,
  Mail,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { settingsApi } from '@/api/settings.api';
import './settings.css';
import { MediaPickerInput } from '@/components/media/MediaPickerInput';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingType = 'text' | 'integer' | 'boolean' | 'select' | 'textarea' | 'file';

interface Setting {
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

type FieldValues     = Record<string, Setting['value']>;
type FieldErrors     = Record<string, string>;

type GroupedSettings = Record<string, Setting[]>;

interface GroupMeta {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const GROUP_META: Record<string, Omit<GroupMeta, 'key'>> = {
  general: {
    label: 'General',
    icon: Settings2,
    description: 'App name, URL, timezone, and maintenance mode.',
  },
  seo: {
    label: 'SEO',
    icon: Settings2,
    description: 'SEO settings including site title, meta description, and meta keywords.',
  },
  email: {
    label: 'Email',
    icon: Mail,
    description: 'Sender details, SMTP host, port, and mail driver.',
  },
  security: {
    label: 'Security',
    icon: ShieldCheck,
    description: 'Two-factor auth, session lifetime, and IP allowlist.',
  },
  notifications: {
    label: 'Notifications',
    icon: Bell,
    description: 'Email alerts, Slack webhooks, and admin contact.',
  },
};

const getGroupMeta = (key: string): GroupMeta => ({
  key,
  ...(GROUP_META[key] ?? {
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: Settings2,
    description: `Settings for the "${key}" group.`,
  }),
});


// ---------------------------------------------------------------------------
// SettingField — renders the right control for each setting type
// ---------------------------------------------------------------------------

interface SettingFieldProps {
  setting:  Setting;
  value:    Setting['value'];
  onChange: (val: Setting['value']) => void;
  hasError: boolean;
}

function SettingField({ setting, value, onChange, hasError }: SettingFieldProps) {
  if (setting.type === 'boolean') {
    const checked = Boolean(value);
    return (
      <div className="settings-toggle-row">
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="settings-toggle-slider" />
        </label>
        <span className="settings-toggle-label">{checked ? 'Enabled' : 'Disabled'}</span>
      </div>
    );
  }

  if (setting.type === 'select') {
    return (
      <select
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? 'field-error' : undefined}
      >
        {setting.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (setting.type === 'textarea') {
    return (
      <textarea
        value={String(value ?? '')}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? 'field-error' : undefined}
      />
    );
  }

  if (setting.type === 'file') {
    return <MediaPickerInput value={value?.toString() ?? ''} onChange={onChange} />;
  }

  // text | integer
  return (
    <input
      type={setting.type === 'integer' ? 'number' : 'text'}
      value={String(value ?? '')}
      onChange={(e) =>
        onChange(setting.type === 'integer' ? Number(e.target.value) : e.target.value)
      }
      className={hasError ? 'field-error' : undefined}
    />
  );
}

// ---------------------------------------------------------------------------
// GroupEditor — the right-hand panel for one group (mirrors section editors)
// ---------------------------------------------------------------------------

interface GroupEditorProps {
  groupKey: string;
  settings: Setting[];
  onSaved:  (updatedSettings: Setting[]) => void;
}

function GroupEditor({ groupKey, settings, onSaved }: GroupEditorProps) {
  const initValues = (): FieldValues =>
    Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const [values, setValues]   = useState<FieldValues>(initValues);
  const [errors, setErrors]   = useState<FieldErrors>({});
  const [status, setStatus]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Reset local state when the active group changes
  useEffect(() => {
    setValues(initValues());
    setErrors({});
    setStatus('idle');
  }, [groupKey]);

  const isDirty =
    JSON.stringify(values) !== JSON.stringify(initValues());

  const handleChange = (key: string, val: Setting['value']) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSave = async () => {
    setStatus('saving');
    setErrors({});
    try {
      await settingsApi.update(
        values ,
      );
      // Optimistically update parent
      const updated = settings.map((s) => ({ ...s, value: values[s.key] }));
      onSaved(updated);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err: unknown) {
      setStatus('error');
      if (err && typeof err === 'object' && 'errors' in err) {
        setErrors(err.errors as FieldErrors);
      }
    }
  };

  const meta = getGroupMeta(groupKey);
  const Icon = meta.icon;

  return (
    <>
      {/* Editor area header — matches .editor-area-header pattern */}
      <div className="settings-editor-header">
        <div className="settings-editor-header-left">
          <Icon size={18} />
          <div>
            <h2>{meta.label}</h2>
            <p>{meta.description}</p>
          </div>
        </div>

        <button
          className={`btn-save ${status === 'saved' ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={status === 'saving'}
        >
          {status === 'saving' ? (
            <><Loader2 size={14} className="spin" /> Saving…</>
          ) : status === 'saved' ? (
            <><CheckCircle2 size={14} /> Saved</>
          ) : (
            <><Save size={14} /> Save changes</>
          )}
        </button>
      </div>

      {/* Editor body */}
      <div className="settings-editor-body">
        <div className="settings-group-editor">

          {/* Feedback banners */}
          {status === 'saved' && (
            <p className="settings-feedback success">
              <CheckCircle2 size={13} /> Changes saved successfully.
            </p>
          )}
          {status === 'error' && Object.keys(errors).length === 0 && (
            <p className="settings-feedback error">
              <AlertCircle size={13} /> Something went wrong. Please try again.
            </p>
          )}
          {isDirty && status === 'idle' && (
            <p className="settings-feedback dirty">
              <AlertCircle size={13} /> You have unsaved changes.
            </p>
          )}

          {/* Fields */}
          {settings.map((s) => (
            <div key={s.key} className="settings-field-group">
              <label htmlFor={`field-${s.key}`}>{s.label}</label>

              {s.description && (
                <p className="settings-field-desc">{s.description}</p>
              )}

              <SettingField
                setting={s}
                value={values[s.key]}
                onChange={(v) => handleChange(s.key, v)}
                hasError={!!errors[s.key]}
              />

              {errors[s.key] && (
                <p className="settings-field-error">{errors[s.key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// SettingsPage  (mirrors ContentPage structure 1-to-1)
// ---------------------------------------------------------------------------

function SettingsPage() {
  const pathSegments = window.location.pathname.split('/');
  const settingsIndex = pathSegments.indexOf('settings');
  const requestedKey = settingsIndex >= 0 ? pathSegments[settingsIndex + 1] : undefined;
  const initialActiveKey = requestedKey && requestedKey.length <= 50 ? requestedKey : 'general';

  const [grouped, setGrouped] = useState<GroupedSettings>({});
  const [activeKey, setActiveKey] = useState(initialActiveKey);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    settingsApi.list()
      .then((res) => {
        const data = res.data.data as GroupedSettings;
        setGrouped(data);
        const keys = Object.keys(data);
        if (keys.length > 0 && !data[initialActiveKey]) setActiveKey(keys[0]);
      })
      .catch(() => setFetchError('Failed to load settings. Please refresh.'))
      .finally(() => setLoading(false));
  }, [initialActiveKey]);
  
  const handleSaved = (updated: Setting[]) => {
    setGrouped((prev) => ({ ...prev, [activeKey]: updated }));
  };


  return (
    <div className="settings-page">

      {/* Header */}
      <div className="settings-page-header">
        <h1>Settings</h1>
        <p>Manage application-wide configuration. Changes are saved to the database and take effect immediately.</p>
      </div>

      <div className="settings-layout">

        {/* ── Editor area (mirrors .editor-area) ── */}
        <div className="settings-editor-area" ref={bodyRef as React.RefObject<HTMLDivElement>}>

          {loading && (
            <div className="settings-loading">Loading settings…</div>
          )}

          {fetchError && !loading && (
            <div className="settings-loading">{fetchError}</div>
          )}

          {!loading && !fetchError && (
            <GroupEditor
              key={activeKey}
              groupKey={activeKey}
              settings={grouped[activeKey] ?? []}
              onSaved={(updated) => handleSaved(updated)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

SettingsPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default SettingsPage;