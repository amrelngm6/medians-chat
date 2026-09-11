/**
 * homeMenu.api.ts
 * ─────────────────────────────────────────────────────────────────
 * Thin Axios wrapper for the HomeMenu REST API.
 *
 * Mirrors the pattern used by settings.api — import your preconfigured
 * Axios instance (aliased `api`) from wherever it lives in your project,
 * e.g. `@/lib/axios` or `@/api/axios`.
 *
 * Endpoints map 1-to-1 with HomeMenuController:
 *   GET    /api/v1/home-menus          → index()
 *   GET    /api/v1/home-menus/:id      → show()
 *   POST   /api/v1/home-menus          → store()
 *   PUT    /api/v1/home-menus/:id      → update()
 *   DELETE /api/v1/home-menus/:id      → destroy()
 * ─────────────────────────────────────────────────────────────────
 */

import client from './client';
import type { HomeMenu } from '../types/menus.types';

// ---------------------------------------------------------------------------
// Payload types (align with HomeMenuController validation rules)
// ---------------------------------------------------------------------------

export interface HomeMenuPayload {
    title?: string;
    icon?: string | null;
    url?: string | null;
    target?: '_self' | '_blank';
    sort_order?: number;
    is_active?: boolean;
    parent_id?: string | null;
}

// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------

export const homeMenuApi = {
    /**
     * GET /api/v1/home-menus
     * Returns all menu items as a hierarchical tree (parent → children[]).
     */
    index: () =>
        client.get<{ success: true; data: HomeMenu[] }>('/home-menus'),

    /**
     * GET /api/v1/home-menus/:id
     * Returns a single menu item by UUID.
     */
    show(id: string) {
        return client.get(`/home-menus/${id}`);
    },

    /**
     * POST /api/v1/home-menus
     * Creates a new menu item. Requires auth.
     */
    store(data: HomeMenuPayload) {
        return client.post('/home-menus', data);
    },

    /**
     * PUT /api/v1/home-menus/:id
     * Updates an existing menu item by UUID. Requires auth.
     */
    update(id: string, data: HomeMenuPayload) {
        return client.put(`/home-menus/${id}`, data);
    },

    /**
     * DELETE /api/v1/home-menus/:id
     * Deletes a menu item by UUID. Requires auth.
     */
    destroy(id: string) {
        return client.delete(`/home-menus/${id}`);
    },
};