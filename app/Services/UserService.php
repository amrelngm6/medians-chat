<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function list(int $page = 1, int $limit = 20): LengthAwarePaginator
    {
        return User::query()
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);
    }

    public function findOrFail(string $id): User
    {
        return User::findOrFail($id);
    }

    public function create(array $data): User
    {
        return User::create([
            'first_name'    => $data['first_name'],
            'last_name'     => $data['last_name'],
            'email'         => $data['email'],
            'password_hash' => Hash::make($data['password']),
            'status'        => $data['status'] ?? 'active',
            'timezone'      => $data['timezone'] ?? 'UTC',
        ]);
    }

    public function update(User $user, array $data): User
    {
        $user->fill(array_filter([
            'first_name' => $data['first_name'] ?? null,
            'email'      => $data['email'] ?? null,
            'status'     => $data['status'] ?? null,
        ], fn ($v) => $v !== null));

        $user->save();

        return $user->fresh();
    }

    public function resetPassword(User $user, string $password): void
    {
        $user->update(['password_hash' => Hash::make($password)]);
    }

    public function delete(User $user): void
    {
        $user->delete(); // soft delete via SoftDeletes trait
    }
}
