<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class HomeMenu extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'icon',
        'url',
        'target',
        'sort_order',
        'is_active',
        'parent_id',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (HomeMenu $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Parent menu item relationship.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(HomeMenu::class, 'parent_id');
    }

    /**
     * Sub-menu items relationship.
     */
    public function children(): HasMany
    {
        return $this->hasMany(HomeMenu::class, 'parent_id')->orderBy('sort_order', 'asc');
    }

    /**
     * Scope query to active menu items.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope query to top-level menu items (no parent).
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope query ordered by sort_order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}
