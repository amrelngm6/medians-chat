<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class FormMessage extends Model
{
    use SoftDeletes;

    public $incrementing = false;
    protected $keyType   = 'string';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'meta',
        'form_key',
        'status',
        'user_id',
        'handled_by',
        'reply',
        'replied_at',
        'ip_address',
        'user_agent',
        'read_at',
    ];

    protected $casts = [
        'meta'       => 'array',
        'read_at'    => 'datetime',
        'replied_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ── Status constants ───────────────────────────────────────────────────────

    const STATUS_NEW      = 'new';
    const STATUS_READ     = 'read';
    const STATUS_REPLIED  = 'replied';
    const STATUS_ARCHIVED = 'archived';
    const STATUS_SPAM     = 'spam';

    const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_READ,
        self::STATUS_REPLIED,
        self::STATUS_ARCHIVED,
        self::STATUS_SPAM,
    ];

    // ── Boot ───────────────────────────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (FormMessage $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    // ── Relationships ──────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    // ── Scopes ─────────────────────────────────────────────────────────────────

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByFormKey($query, string $key)
    {
        return $query->where('form_key', $key);
    }

    public function scopeUnread($query)
    {
        return $query->where('status', self::STATUS_NEW);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    public function isNew(): bool
    {
        return $this->status === self::STATUS_NEW;
    }

    public function markAsRead(): void
    {
        if ($this->status === self::STATUS_NEW) {
            $this->update([
                'status'  => self::STATUS_READ,
                'read_at' => now(),
            ]);
        }
    }
}
