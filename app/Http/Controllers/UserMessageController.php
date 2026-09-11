<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserMessageRequest;
use App\Http\Requests\UpdateUserMessageRequest;
use App\Http\Resources\UserMessageResource;
use App\Services\UserMessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserMessageController extends Controller
{
    public function __construct(
        private readonly UserMessageService $service,
    ) {}

    /**
     * GET /api/v1/user-messages
     *
     * List user messages with optional pagination and search query.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search']);
        $page    = (int) $request->query('page', 1);
        $limit   = (int) $request->query('limit', 20);

        $paginator = $this->service->list($filters, $page, $limit);

        return response()->json([
            'success' => true,
            'data'    => UserMessageResource::collection($paginator->items()),
            'meta'    => [
                'page'      => $paginator->currentPage(),
                'limit'     => $paginator->perPage(),
                'total'     => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/user-messages/popular
     *
     * Fetch top / most popular user messages.
     */
    public function popular(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 5);
        $data  = $this->service->getPopularMessages($limit);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * GET /api/v1/user-messages/{id}
     *
     * Fetch single user message.
     */
    public function show(string $id): JsonResponse
    {
        $userMessage = $this->service->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new UserMessageResource($userMessage),
        ]);
    }

    /**
     * POST /api/v1/user-messages
     *
     * Create user message.
     */
    public function store(CreateUserMessageRequest $request): JsonResponse
    {
        $userMessage = $this->service->create(
            data:    $request->validated(),
            ip:      $request->ip(),
            browser: $request->userAgent(),
        );

        return response()->json([
            'success' => true,
            'data'    => new UserMessageResource($userMessage),
        ], 201);
    }

    /**
     * PUT/PATCH /api/v1/user-messages/{id}
     *
     * Update user message.
     */
    public function update(UpdateUserMessageRequest $request, string $id): JsonResponse
    {
        $userMessage = $this->service->findOrFail($id);
        $updated     = $this->service->update($userMessage, $request->validated());

        return response()->json([
            'success' => true,
            'data'    => new UserMessageResource($updated),
        ]);
    }

    /**
     * DELETE /api/v1/user-messages/{id}
     *
     * Soft delete user message.
     */
    public function destroy(string $id): JsonResponse
    {
        $userMessage = $this->service->findOrFail($id);
        $this->service->delete($userMessage);

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * POST /api/v1/user-messages/{id}/restore
     *
     * Restore soft-deleted user message.
     */
    public function restore(string $id): JsonResponse
    {
        $restored = $this->service->restore($id);

        return response()->json([
            'success' => true,
            'data'    => new UserMessageResource($restored),
        ]);
    }

    /**
     * DELETE /api/v1/user-messages/{id}/force
     *
     * Permanent delete user message.
     */
    public function forceDelete(string $id): JsonResponse
    {
        $this->service->forceDelete($id);

        return response()->json([
            'success' => true,
        ]);
    }
}
