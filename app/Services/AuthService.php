<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(string $email, string $password): array
    {

        $credentials = ['email' => $email, 'password' => $password];

        // Try to authenticate with different guards
        if (Auth::guard('superadmin')->attempt($credentials)) {
            $user = Auth::guard('superadmin')->user();
            $token = $user->createToken('API Token')->plainTextToken;
            
            $user->update(['last_login_at' => now()]);

            return [
                'success' => true,
                'user' => $user,
                'token' => $token,
                'guard' => 'superadmin'
            ];
        }
        
        return [
            'success' => false,
        ];
    }

    public function me(): User
    {
        return Auth::user();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $user->password_hash)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['The current password is incorrect.'],
            ]);
        }

        $user->update(['password_hash' => Hash::make($newPassword)]);
    }
}
