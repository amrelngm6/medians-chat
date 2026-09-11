/**
 * content-loader.js
 * 
 * Fetches live content from the CMS API and injects it into the
 * theme's DOM before app.js reads it at DOMContentLoaded / load time.
 *
 * The API endpoint GET /api/v1/content returns a key→data map.
 * This script runs synchronously-via-async before the main app.js
 * initializes flows, so the HTML sections are pre-populated with
 * the latest saved content.
 */


(async function () {
  'use strict';

  // -- Config --------------------------------------------------------------
  // Point this at your backend. During development this is typically
  // proxied through Vite or served directly. Update as needed.
  const API_BASE = window.__CMS_API__ || '/api/v1';

  // -- Fetch content --------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/content?locale=${getCookies('locale') || 'en'}`, { credentials: 'include' });
    if (res.ok) {
      const json = await res.json();
      window.contentJson = json.data || {};
    }
  } catch (e) {
    // Silently fall back to static HTML if the API is unreachable
    console.warn('[CMS] Could not reach content API — using static HTML.', e.message);
    return;
  }


  // Initialize the chat flows after content has been loaded
  function initializeRouting() {

    // Handle URL routing after content is loaded
    const currentPath = window.location.pathname.replace(/^\/+|\/+$/g, '');

    // Validate for letters and numbers only
    if (currentPath) {
      const isValid = /^[a-zA-Z0-9-]+$/.test(currentPath);
      if (!isValid) {
        window.location.href = '/';
      } else {
        const textCommand = currentPath.replace(/-/g, ' ');
        generateAndProcessResponse(currentPath, textCommand);
      }
    }
  }

  // Initialize the chat flows after content has been loaded
  initializeFlows();

  initializeRouting();

})();
