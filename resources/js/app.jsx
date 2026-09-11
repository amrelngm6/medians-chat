import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './src/App';
import '../css/index.css';
import '../css/theme.css';
import '../css/all.min.css';
import '../css/style.css';

// Ensure initial page dataset contains required Inertia properties
const appEl = document.getElementById('app');
if (appEl) {
  let pageData = {};
  if (appEl.dataset.page) {
    try {
      pageData = JSON.parse(appEl.dataset.page);
    } catch {
      pageData = {};
    }
  }
  if (!pageData || Array.isArray(pageData) || typeof pageData !== 'object') {
    pageData = {};
  }
  if (!pageData.url) {
    pageData.url = window.location.pathname + window.location.search + window.location.hash || '/';
  }
  if (!pageData.component) {
    pageData.component = 'admin/DashboardPage';
  }
  if (!pageData.props) {
    pageData.props = {};
  }
  if (pageData.version === undefined) {
    pageData.version = '';
  }
  appEl.dataset.page = JSON.stringify(pageData);
}

createInertiaApp({
  // Resolves page components by their Inertia page name.
  // Laravel controllers pass e.g. 'Admin/DashboardPage' → src/pages/Admin/DashboardPage.tsx
  resolve: (name) => {
    const pages = import.meta.glob('./src/pages/**/*.tsx', { eager: true });
    const targetName = name || 'admin/DashboardPage';

    let page = pages[`./src/pages/${targetName}.tsx`];

    if (!page) {
      const lowerTarget = `./src/pages/${targetName}.tsx`.toLowerCase();
      const matchedKey = Object.keys(pages).find(
        (key) => key.toLowerCase() === lowerTarget
      );
      if (matchedKey) {
        page = pages[matchedKey];
      }
    }

    if (!page && !targetName.endsWith('Page')) {
      const pageWithName = `${targetName}Page`;
      page = pages[`./src/pages/${pageWithName}.tsx`];
      if (!page) {
        const lowerTargetWithName = `./src/pages/${pageWithName}.tsx`.toLowerCase();
        const matchedKey = Object.keys(pages).find(
          (key) => key.toLowerCase() === lowerTargetWithName
        );
        if (matchedKey) {
          page = pages[matchedKey];
        }
      }
    }

    if (!page) {
      throw new Error(
        `Inertia page component "${name}" not found. Available pages: ${Object.keys(pages).join(', ')}`
      );
    }

    return page;
  },

  setup({ el, App: InertiaApp, props }) {
    createRoot(el).render(
      <React.StrictMode>
        <App>
          <InertiaApp {...props} />
        </App>
      </React.StrictMode>,
    );
  },
});
