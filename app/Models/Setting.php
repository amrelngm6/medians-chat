<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class Setting extends Model
{
    protected $fillable = [
        'group',
        'key',
        'label',
        'value',
        'type',
        'options',
        'description',
        'is_public',
        'is_encrypted',
        'sort_order',
    ];

    protected $casts = [
        'is_public'    => 'boolean',
        'is_encrypted' => 'boolean',
        'sort_order'   => 'integer',
    ];

    // ── Accessors / Mutators ─────────────────────────────────────────────────

    /**
     * Return the value cast to its declared type.
     */
    public function getTypedValueAttribute(): mixed
    {
        $raw = $this->is_encrypted ? Crypt::decryptString($this->value) : $this->value;

        return match ($this->type) {
            'boolean' => (bool) $raw,
            'integer' => (int) $raw,
            'json'    => json_decode($raw, true),
            default   => $raw,
        };
    }

    /**
     * Decode stored JSON options for select fields.
     */
    public function getOptionsArrayAttribute(): array
    {
        if (! $this->options) {
            return [];
        }

        return json_decode($this->options, true) ?? [];
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    public function scopeGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('group')->orderBy('sort_order');
    }

    // ── Static helpers ───────────────────────────────────────────────────────

    /**
     * Get a single setting value by key with an optional fallback.
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $cacheKey = "setting:{$key}";

        $setting = Cache::rememberForever($cacheKey, fn () => static::where('key', $key)->first());

        return $setting ? $setting->typed_value : $default;
    }

    /**
     * Persist a value and bust the cache.
     */
    public static function setValue(string $key, mixed $value): bool
    {
        $setting = static::where('key', $key)->first();

        if (! $setting) {
            return false;
        }

        $stored = $setting->is_encrypted ? Crypt::encryptString((string) $value) : (string) $value;

        $setting->update(['value' => $stored]);

        Cache::forget("setting:{$key}");
        Cache::forget('settings:all');

        return true;
    }

    /**
     * Return all settings, grouped by their group slug, keyed by key.
     */
    public static function allGrouped(): array
    {
        return Cache::rememberForever('settings:all', function () {
            return static::ordered()
                ->get()
                ->groupBy('group')
                ->map(fn ($items) => $items->keyBy('key'))
                ->toArray();
        });
    }

    /**
     * Flush all setting caches (call after bulk updates).
     */
    public static function flushCache(): void
    {
        Cache::forget('settings:all');
        static::query()->pluck('key')->each(fn ($k) => Cache::forget("setting:{$k}"));
    }
}
