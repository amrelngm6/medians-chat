<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class SettingService
{
    /**
     * Return every setting row, grouped by group slug.
     * Shape: ['general' => [['key' => ..., 'value' => ..., ...], ...], ...]
     */
    public function getGrouped(): array
    {
        return Setting::ordered()
            ->get()
            ->groupBy('group')
            ->map(fn (Collection $items) => $items->map(fn (Setting $s) => $this->format($s))->values())
            ->toArray();
    }

    /**
     * Return settings for a single group.
     */
    public function getGroup(string $group): array
    {
        return Setting::group($group)
            ->ordered()
            ->get()
            ->map(fn (Setting $s) => $this->format($s))
            ->values()
            ->toArray();
    }

    /**
     * Get group meta
     */
    public function getGroupMeta(string $group): array
    {
        $total = Setting::group($group)->count();
        return [
            'name'  => $group,
            'label' => ucfirst($group),
            'description' => 'Edit system settings related to ' . ucfirst($group),
        ];
    }

    /**
     * Return all distinct group names with counts.
     */
    public function getGroups(): array
    {
        return Setting::selectRaw('`group`, COUNT(*) as total')
            ->groupBy('group')
            ->orderBy('group')
            ->get()
            ->map(fn ($row) => [
                'name'  => $row->group,
                'label' => ucfirst($row->group),
                'total' => $row->total,
            ])
            ->toArray();
    }

    /**
     * Bulk-update settings from a key→value map.
     * Only keys that already exist in the DB are written.
     *
     * @param  array<string, mixed>  $data
     */
    public function bulkUpdate(array $data): void
    {
        $existing = Setting::whereIn('key', array_keys($data))->get()->keyBy('key');

        foreach ($data as $key => $value) {
            /** @var Setting|null $setting */
            $setting = $existing->get($key);

            if (! $setting) {
                continue;
            }

            $this->validateValue($setting, $value);

            $setting->update(['value' => $this->castForStorage($setting, $value)]);
        }

        Setting::flushCache();
    }

    /**
     * Update a single setting by key.
     */
    public function update(string $key, mixed $value): Setting
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        $this->validateValue($setting, $value);

        $setting->update(['value' => $this->castForStorage($setting, $value)]);

        Setting::flushCache();

        return $setting->fresh();
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Format a Setting model for the API response.
     */
    private function format(Setting $s): array
    {
        return [
            'id'          => $s->id,
            'group'       => $s->group,
            'key'         => $s->key,
            'label'       => $s->label,
            'value'       => $s->typed_value,
            'type'        => $s->type,
            'options'     => $s->options_array,
            'description' => $s->description,
            'is_public'   => $s->is_public,
            'sort_order'  => $s->sort_order,
        ];
    }

    /**
     * Validate the incoming value against the setting's type & constraints.
     *
     * @throws ValidationException
     */
    private function validateValue(Setting $setting, mixed $value): void
    {
        $rules = match ($setting->type) {
            'integer' => ['numeric'],
            'boolean' => ['boolean'],
            'select'  => ['in:' . implode(',', $setting->options_array)],
            'json'    => ['array'],
            default   => ['string', 'max:65535'],
        };

        $validator = validator(
            ['value' => $value],
            ['value' => array_merge(['nullable'], $rules)]
        );

        if ($validator->fails()) {
            throw ValidationException::withMessages([
                $setting->key => $validator->errors()->first('value'),
            ]);
        }
    }

    /**
     * Cast a typed PHP value back to a string suitable for DB storage.
     */
    private function castForStorage(Setting $setting, mixed $value): string
    {
        return match ($setting->type) {
            'boolean' => $value ? '1' : '0',
            'json'    => json_encode($value),
            default   => (string) $value,
        };
    }
}
