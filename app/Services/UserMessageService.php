<?php

namespace App\Services;

use App\Models\UserMessage;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserMessageService
{
    /**
     * Get top / most popular user messages grouped by message string.
     */
    public function getPopularMessages(int $limit = 5): array
    {
        $total = UserMessage::count();
        if ($total === 0) {
            return [];
        }

        $results = UserMessage::query()
            ->select('message', DB::raw('COUNT(*) as count'), DB::raw('MAX(created_at) as last_used_at'))
            ->groupBy('message')
            ->orderByDesc('count')
            ->orderByDesc('last_used_at')
            ->limit($limit)
            ->get();

        return $results->map(function ($row) use ($total) {
            return [
                'message'      => $row->message,
                'count'        => (int) $row->count,
                'percentage'   => round(($row->count / $total) * 100, 1),
                'last_used_at' => $row->last_used_at ? Carbon::parse($row->last_used_at)->toISOString() : null,
            ];
        })->toArray();
    }

    /**
     * Paginated list with optional search filters.
     */
    public function list(array $filters = [], int $page = 1, int $limit = 20): LengthAwarePaginator
    {
        $query = UserMessage::query()
            ->orderBy('created_at', 'desc');

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('message', 'like', $term)
                  ->orWhere('ip', 'like', $term)
                  ->orWhere('browser', 'like', $term);
            });
        }

        return $query->paginate($limit, ['*'], 'page', $page);
    }

    /**
     * Find a single UserMessage by ID or throw 404.
     */
    public function findOrFail(string $id): UserMessage
    {
        return UserMessage::findOrFail($id);
    }

    /**
     * Store a new UserMessage record.
     */
    public function create(array $data, ?string $ip = null, ?string $browser = null): UserMessage
    {
        return UserMessage::create([
            'message' => $data['message'],
            'ip'      => $data['ip'] ?? $ip ?? '127.0.0.1',
            'browser' => $data['browser'] ?? $browser ?? 'Unknown',
        ]);
    }

    /**
     * Update an existing UserMessage record.
     */
    public function update(UserMessage $userMessage, array $data): UserMessage
    {
        $userMessage->fill(array_filter([
            'message' => $data['message'] ?? null,
            'ip'      => $data['ip'] ?? null,
            'browser' => $data['browser'] ?? null,
        ], fn ($v) => $v !== null));

        $userMessage->save();

        return $userMessage->fresh();
    }

    /**
     * Soft delete a UserMessage record.
     */
    public function delete(UserMessage $userMessage): void
    {
        $userMessage->delete();
    }

    /**
     * Restore a soft-deleted UserMessage record.
     */
    public function restore(string $id): UserMessage
    {
        $userMessage = UserMessage::withTrashed()->findOrFail($id);
        $userMessage->restore();

        return $userMessage->fresh();
    }

    /**
     * Permanently delete a UserMessage record.
     */
    public function forceDelete(string $id): void
    {
        UserMessage::withTrashed()->findOrFail($id)->forceDelete();
    }
}
