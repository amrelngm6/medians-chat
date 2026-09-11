<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ContentSectionTranslation extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'content_section_translations';

    protected $fillable = [
        'content_section_id',
        'locale',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    protected $appends = ['section_key'];

    protected static function booted(): void
    {
        static::creating(function (ContentSectionTranslation $translation) {
            $translation->id ??= (string) Str::uuid();
        });
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(ContentSection::class, 'content_section_id');
    }

    public function getSectionKeyAttribute(): ?string
    {
        return $this->section?->section_key;
    }
}