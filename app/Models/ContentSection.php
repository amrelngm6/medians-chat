<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ContentSection extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'section_key',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (ContentSection $section) {
            $section->id ??= (string) Str::uuid();
        });
    }
}
