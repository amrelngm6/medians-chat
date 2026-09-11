import type { ReactNode } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import {sectionComponents} from './sections';
import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import './content.css';

// ---------------------------------------------------------------------------
// Content Components Map
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// ContentPage
// ---------------------------------------------------------------------------

function ContentPage() {
  const [locale, setLocale] = useState(() => new URLSearchParams(window.location.search).get('locale') || 'en');
  const urlActiveKey = window.location.pathname
    .replace('/admin/content/', '')
    .replace(/\/$/, '') as keyof typeof sectionComponents;

  let active = sectionComponents[urlActiveKey ?? 'intro'];

  if (!active) {
    active = sectionComponents.generic;
  }

  // Invalid / unknown component
  if (!active) {
    return (
      <div className="content-page">
        <div className="content-page-header">
          <h1>Content Manager</h1>
          <p>Content section not found.</p>
        </div>
      </div>
    );
  }


  const Icon = Settings2;
  const Component = active;
  const label = urlActiveKey.charAt(0).toUpperCase() + urlActiveKey.slice(1);
  const description = '';

  return (
    <div className="content-page">
      {/* Header */}
      <div className="content-page-header">
        <div className="flex gap-4">
          <div className="w-full">
            <h1>{label} Content Manager</h1>
            <p>
              Edit every section of your portfolio template. Changes are saved to
              the database and reflected live on the site.
            </p>
          </div>
          <div className="w-56 field-group">
            <label htmlFor="content-locale">Language</label>
            <select
              id="content-locale"
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
        </div>
      </div>

      <div className="content-layout">
        {/* Editor area */}
        <div className="editor-area">
          <div className="editor-area-header">
            <Icon size={18} />

            <div>
              <h2>{label}</h2>
              <p>{description}</p>
            </div>
          </div>

          <div className="editor-area-body">
            <Component sectionKey={urlActiveKey} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}

ContentPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default ContentPage;