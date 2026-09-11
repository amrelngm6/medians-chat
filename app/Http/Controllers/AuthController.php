<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    /**
     * POST /auth/login
     * React: authApi.login(email, password)
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $response = $this->authService->login(
            $request->validated('email'),
            $request->validated('password'),
        );

        if (empty($response['success']))
        {
            return response()->json(['success' => false], 401);
        }

        return response()->json(['user' => $response['user']])
            ->cookie('token', $response['token'], 60 * 24 * 7, '/', null, true, true);
    }

    /**
     * POST /auth/logout
     * React: authApi.logout()
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true])
            ->withoutCookie('token');
    }

    /**
     * GET /auth/me
     * React: authApi.me()
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    /**
     * PUT /auth/password
     * React: authApi.changePassword(currentPassword, newPassword)
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword(
            $request->user(),
            $request->validated('currentPassword'),
            $request->validated('newPassword'),
        );

        return response()->json(['success' => true]);
    }
}
