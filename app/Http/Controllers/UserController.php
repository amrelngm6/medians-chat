<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    /**
     * GET /users
     * Returns paginated user list.
     * React: usersApi.list()
     */
    public function index(Request $request): JsonResponse
    {
        $page  = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 20);

        $paginator = $this->userService->list($page, $limit);

        return response()->json([
            'success' => true,
            'users'   => $paginator->items(),
            'meta'    => [
                'page'  => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * GET /users/{id}
     * React: usersApi.get(id)
     */
    public function show(string $id): JsonResponse
    {
        $user = $this->userService->findOrFail($id);

        return response()->json(['user' => $user]);
    }

    /**
     * POST /users
     * React: usersApi.create(data)
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json(['user' => $user], 201);
    }

    /**
     * PUT /users/{id}
     * React: usersApi.update(id, data)
     */
    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $user    = $this->userService->findOrFail($id);
        $updated = $this->userService->update($user, $request->validated());

        return response()->json(['user' => $updated]);
    }

    /**
     * PUT /users/{id}/password
     * React: usersApi.resetPassword(id, password)
     */
    public function resetPassword(ResetPasswordRequest $request, string $id): JsonResponse
    {
        $user = $this->userService->findOrFail($id);
        $this->userService->resetPassword($user, $request->validated('password'));

        return response()->json(['success' => true]);
    }

    /**
     * DELETE /users/{id}
     * React: usersApi.delete(id)
     */
    public function destroy(string $id): JsonResponse
    {
        $user = $this->userService->findOrFail($id);
        $this->userService->delete($user);

        return response()->json(['success' => true]);
    }
}
