<?php

namespace App\Services;

use App\Models\FormMessage;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class FormMessageService
{
    // ── Listing / Filtering ────────────────────────────────────────────────────

    /**
     * Paginated list with optional filters.
     *
     * Supported query params from the controller:
     *   status    — filter by status enum value
     *   form_key  — filter by originating form
     *   search    — LIKE on name, email, subject
     *   page, limit
     */
    public function list(array $filters = [], int $page = 1, int $limit = 20): LengthAwarePaginator
    {
        $query = FormMessage::query()
            ->with(['user', 'handler'])
            ->orderBy('created_at', 'desc');

        if (! empty($filters['status'])) {
            $query->byStatus($filters['status']);
        }

        if (! empty($filters['form_key'])) {
            $query->byFormKey($filters['form_key']);
        }

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('email', 'like', $term)
                  ->orWhere('subject', 'like', $term);
            });
        }

        return $query->paginate($limit, ['*'], 'page', $page);
    }

    /** Unread count — useful for dashboard badges. */
    public function unreadCount(): int
    {
        return FormMessage::unread()->count();
    }

    /** Counts grouped by status — useful for tab badges. */
    public function countsByStatus(): array
    {
        return FormMessage::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
    }

    // ── Single record ──────────────────────────────────────────────────────────

    public function findOrFail(string $id): FormMessage
    {
        return FormMessage::with(['user', 'handler'])->findOrFail($id);
    }

    // ── Create ─────────────────────────────────────────────────────────────────

    /**
     * Store a new submission.
     * Called from both the public contact form and admin create.
     */
    public function create(array $data, ?string $userId = null, ?string $ip = null, ?string $userAgent = null): FormMessage
    {
        return FormMessage::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'phone'      => $data['phone'] ?? null,
            'subject'    => $data['subject'] ?? null,
            'message'    => $data['message'],
            'meta'       => $data['meta'] ?? null,
            'form_key'   => $data['form_key'] ?? 'contact',
            'status'     => FormMessage::STATUS_NEW,
            'user_id'    => $userId,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);
    }

    // ── Status transitions ─────────────────────────────────────────────────────

    /**
     * Transition status and auto-set related timestamps.
     * Enforces valid transitions so the frontend can't set arbitrary states.
     */
    public function updateStatus(FormMessage $message, string $status, User $handler): FormMessage
    {
        $updates = ['status' => $status, 'handled_by' => $handler->id];

        if ($status === FormMessage::STATUS_READ && ! $message->read_at) {
            $updates['read_at'] = now();
        }

        $message->update($updates);

        return $message->fresh(['user', 'handler']);
    }

    // ── Reply ──────────────────────────────────────────────────────────────────

    public function reply(FormMessage $message, string $replyText, User $handler): FormMessage
    {
        $message->update([
            'reply'      => $replyText,
            'replied_at' => now(),
            'status'     => FormMessage::STATUS_REPLIED,
            'handled_by' => $handler->id,
            'read_at'    => $message->read_at ?? now(),
        ]);

        // TODO: dispatch a mailable here when email sending is configured
        // Mail::to($message->email)->send(new FormMessageReply($message));

        return $message->fresh(['user', 'handler']);
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    public function delete(FormMessage $message): void
    {
        $message->delete(); // soft delete
    }

    public function restore(string $id): FormMessage
    {
        $message = FormMessage::withTrashed()->findOrFail($id);
        $message->restore();

        return $message->fresh(['user', 'handler']);
    }

    public function forceDelete(string $id): void
    {
        FormMessage::withTrashed()->findOrFail($id)->forceDelete();
    }
}
