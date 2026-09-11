<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReplyFormMessageRequest;
use App\Http\Requests\SubmitFormMessageRequest;
use App\Http\Requests\UpdateFormMessageStatusRequest;
use App\Http\Resources\FormMessageResource;
use App\Services\FormMessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FormMessageController extends Controller
{
    public function __construct(
        private readonly FormMessageService $service,
    ) {}

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PUBLIC
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * POST /form-messages
     *
     * Public endpoint — no auth. Accepts contact/support/quote form submissions.
     * React sends: { name, email, phone?, subject?, message, form_key?, meta? }
     */
    public function submit(SubmitFormMessageRequest $request): JsonResponse
    {
        try {
            $message = $this->service->create(
                data:      $request->validated(),
                ip:        $request->ip(),
                userAgent: $request->userAgent(),
            );

            return response()->json([
                'status' => 'success',
                'message' => __('The form message has been created successfully'),
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => __('Failed to create form message'),
                'error'   => $th->getMessage(),
            ], 500);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ADMIN (auth:sanctum)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * GET /admin/form-messages
     *
     * Paginated list. Supports query params:
     *   ?status=new|read|replied|archived|spam
     *   ?form_key=contact|support|quote
     *   ?search=keyword
     *   ?page=1&limit=20
     *
     * React receives:
     * {
     *   success: true,
     *   data: FormMessage[],
     *   meta: { page, limit, total, last_page },
     *   counts: { new: 5, read: 2, ... }   ← for tab badges
     * }
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'form_key', 'search']);
        $page    = (int) $request->query('page', 1);
        $limit   = (int) $request->query('limit', 20);

        $paginator = $this->service->list($filters, $page, $limit);

        return response()->json([
            'success' => true,
            'data'    => FormMessageResource::collection($paginator->items()),
            'meta'    => [
                'page'      => $paginator->currentPage(),
                'limit'     => $paginator->perPage(),
                'total'     => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
            'counts'  => $this->service->countsByStatus(),
        ]);
    }

    /**
     * GET /admin/form-messages/{id}
     *
     * Fetch a single message and auto-mark it as read.
     *
     * React receives: { success: true, data: FormMessage }
     */
    public function show(string $id): JsonResponse
    {
        $message = $this->service->findOrFail($id);
        $message->markAsRead();

        return response()->json([
            'success' => true,
            'data'    => new FormMessageResource($message),
        ]);
    }

    /**
     * PATCH /admin/form-messages/{id}/status
     *
     * Update status only.
     * React sends: { status: 'archived' }
     * React receives: { success: true, data: FormMessage }
     */
    public function updateStatus(UpdateFormMessageStatusRequest $request, string $id): JsonResponse
    {
        $message = $this->service->findOrFail($id);
        $updated = $this->service->updateStatus(
            message: $message,
            status:  $request->validated('status'),
            handler: $request->user(),
        );

        return response()->json([
            'success' => true,
            'data'    => new FormMessageResource($updated),
        ]);
    }

    /**
     * POST /admin/form-messages/{id}/reply
     *
     * Store a reply text (and optionally dispatch a Mailable).
     * React sends: { reply: 'Thanks for reaching out...' }
     * React receives: { success: true, data: FormMessage }
     */
    public function reply(ReplyFormMessageRequest $request, string $id): JsonResponse
    {
        $message = $this->service->findOrFail($id);
        $updated = $this->service->reply(
            message:   $message,
            replyText: $request->validated('reply'),
            handler:   $request->user(),
        );

        return response()->json([
            'success' => true,
            'data'    => new FormMessageResource($updated),
        ]);
    }

    /**
     * DELETE /admin/form-messages/{id}
     *
     * Soft-delete (recoverable via restore).
     * React receives: { success: true }
     */
    public function destroy(string $id): JsonResponse
    {
        $message = $this->service->findOrFail($id);
        $this->service->delete($message);

        return response()->json(['success' => true]);
    }

    /**
     * POST /admin/form-messages/{id}/restore
     *
     * Restore a soft-deleted message.
     * React receives: { success: true, data: FormMessage }
     */
    public function restore(string $id): JsonResponse
    {
        $message = $this->service->restore($id);

        return response()->json([
            'success' => true,
            'data'    => new FormMessageResource($message),
        ]);
    }

    /**
     * DELETE /admin/form-messages/{id}/force
     *
     * Permanent delete — no recovery.
     * React receives: { success: true }
     */
    public function forceDelete(string $id): JsonResponse
    {
        $this->service->forceDelete($id);

        return response()->json(['success' => true]);
    }

    /**
     * GET /admin/form-messages/stats
     *
     * Quick stats for dashboard widgets.
     * React receives:
     * {
     *   success: true,
     *   data: {
     *     counts: { new: 5, read: 2, replied: 10, archived: 3, spam: 1 },
     *     unread: 5
     *   }
     * }
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'counts' => $this->service->countsByStatus(),
                'unread' => $this->service->unreadCount(),
            ],
        ]);
    }
}
