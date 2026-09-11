<?php

namespace App\Services;

use App\Models\HomeMenu;
use Illuminate\Database\Eloquent\Collection;

class HomeMenuService
{
    /**
     * Get all menu items ordered by sort_order.
     */
    public function getAll(bool $onlyActive = false): Collection
    {
        $query = HomeMenu::query()->ordered();

        if ($onlyActive) {
            $query->active();
        }

        return $query->get();
    }

    /**
     * Get parent-child menu tree structure.
     */
    public function getTree(bool $onlyActive = true): Collection
    {
        $query = HomeMenu::query()->topLevel()->ordered();

        if ($onlyActive) {
            $query->active()->with(['children' => function ($q) {
                $q->active()->ordered();
            }]);
        } else {
            $query->with(['children' => function ($q) {
                $q->ordered();
            }]);
        }

        return $query->get();
    }

    /**
     * Find menu item by ID or throw exception.
     */
    public function findOrFail(string $id): HomeMenu
    {
        return HomeMenu::findOrFail($id);
    }

    /**
     * Create a new menu item.
     */
    public function create(array $data): HomeMenu
    {
        return HomeMenu::create([
            'title'      => $data['title'],
            'icon'       => $data['icon'] ?? null,
            'url'        => $data['url'] ?? null,
            'target'     => $data['target'] ?? '_self',
            'sort_order' => $data['sort_order'] ?? 0,
            'is_active'  => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update an existing menu item.
     */
    public function update(HomeMenu $homeMenu, array $data): HomeMenu
    {
        $homeMenu->fill(array_filter([
            'title'      => $data['title'] ?? null,
            'icon'       => array_key_exists('icon', $data) ? $data['icon'] : null,
            'url'        => array_key_exists('url', $data) ? $data['url'] : null,
            'target'     => $data['target'] ?? null,
            'sort_order' => $data['sort_order'] ?? null,
            'is_active'  => $data['is_active'] ?? null,
        ], fn ($v) => $v !== null));

        $homeMenu->save();

        return $homeMenu->fresh();
    }

    /**
     * Delete a menu item.
     */
    public function delete(HomeMenu $homeMenu): bool
    {
        return (bool) $homeMenu->delete();
    }
}
