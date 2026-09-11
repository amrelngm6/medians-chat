<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use SoftDeletes, HasApiTokens;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'email',
        'password_hash',
        'first_name',
        'last_name',
        'status',
        'last_login_at',
        'avatar_url',
        'timezone',
        'preferences',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'preferences'   => 'array',
        'last_login_at' => 'datetime',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
        'deleted_at'    => 'datetime',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (User $model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    /** Laravel Auth expects getAuthPassword() to return the hashed password. */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    public function createToken(string $name, array $abilities = ['*'])
    {
        return $this->tokens()->create([
            'name' => $name,
            'token' => Str::random(60),
            'abilities' => $abilities,
        ]);
    }
}
