<?php

namespace App\Services;

use App\Models\ContentSection;
use App\Models\FormMessage;
use App\Models\UserMessage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(
        private readonly UserMessageService $userMessageService = new UserMessageService(),
    ) {}

    // ── Form Messages ──────────────────────────────────────────────────────────

    /**
     * Aggregate stats for FormMessage.
     *
     * Returns:
     *   total   — all non-trashed messages
     *   unread  — messages with status = 'new'
     *   counts  — { new, read, replied, archived, spam }
     */
    public function getFormMessageStats(): array
    {
        try {
            $counts = FormMessage::query()
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            $total  = array_sum($counts);
            $unread = (int) ($counts[FormMessage::STATUS_NEW] ?? 0);

            return [
                'total'  => $total,
                'unread' => $unread,
                'counts' => [
                    'new'      => (int) ($counts['new']      ?? 0),
                    'read'     => (int) ($counts['read']     ?? 0),
                    'replied'  => (int) ($counts['replied']  ?? 0),
                    'archived' => (int) ($counts['archived'] ?? 0),
                    'spam'     => (int) ($counts['spam']     ?? 0),
                ],
            ];
        } catch (\Exception $e) {
            return [
                'total'  => 0,
                'unread' => 0,
                'counts' => ['new' => 0, 'read' => 0, 'replied' => 0, 'archived' => 0, 'spam' => 0],
            ];
        }
    }

    // ── User Messages ──────────────────────────────────────────────────────────

    /**
     * Aggregate stats for UserMessage (chat messages sent through the widget).
     *
     * Returns:
     *   total      — all non-trashed messages
     *   this_week  — messages created in the last 7 days
     *   popular    — top popular user messages
     */
    public function getUserMessageStats(): array
    {
        try {
            $total     = UserMessage::count();
            $thisWeek  = UserMessage::where('created_at', '>=', Carbon::now()->subDays(7))->count();
            $popular   = $this->userMessageService->getPopularMessages(5);

            return [
                'total'     => $total,
                'this_week' => $thisWeek,
                'popular'   => $popular,
            ];
        } catch (\Exception $e) {
            return [
                'total'     => 0,
                'this_week' => 0,
                'popular'   => [],
            ];
        }
    }

    // ── Content Sections ───────────────────────────────────────────────────────

    /**
     * Aggregate stats for ContentSection.
     *
     * Returns:
     *   total        — number of content sections defined
     *   last_updated — ISO timestamp of the most recently updated section, or null
     */
    public function getContentSectionStats(): array
    {
        try {
            $total       = ContentSection::count();
            $lastUpdated = ContentSection::max('updated_at');

            return [
                'total'        => $total,
                'last_updated' => $lastUpdated ? Carbon::parse($lastUpdated)->toISOString() : null,
            ];
        } catch (\Exception $e) {
            return [
                'total'        => 0,
                'last_updated' => null,
            ];
        }
    }

    // ── Weekly Activity ────────────────────────────────────────────────────────

    /**
     * Returns an array of 7 daily buckets (oldest → today) counting how many
     * FormMessages and UserMessages were created on each day.
     *
     * Each entry: { label: 'Mon', date: 'YYYY-MM-DD', form_messages: N, user_messages: N }
     */
    public function getWeeklyActivity(): array
    {
        try {
            $days = collect(range(6, 0))->map(fn ($i) => Carbon::now()->subDays($i)->startOfDay());

            // Aggregate FormMessage per day
            $fmByDay = FormMessage::query()
                ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
                ->selectRaw('DATE(created_at) as day, COUNT(*) as count')
                ->groupBy('day')
                ->pluck('count', 'day')
                ->toArray();

            // Aggregate UserMessage per day
            $umByDay = UserMessage::query()
                ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
                ->selectRaw('DATE(created_at) as day, COUNT(*) as count')
                ->groupBy('day')
                ->pluck('count', 'day')
                ->toArray();

            return $days->map(function (Carbon $day) use ($fmByDay, $umByDay) {
                $key = $day->toDateString(); // YYYY-MM-DD
                return [
                    'label'         => $day->format('D'), // Mon, Tue, …
                    'date'          => $key,
                    'form_messages' => (int) ($fmByDay[$key] ?? 0),
                    'user_messages' => (int) ($umByDay[$key] ?? 0),
                ];
            })->values()->toArray();
        } catch (\Exception $e) {
            // Return zeroed-out 7-day array on failure
            return collect(range(6, 0))->map(fn ($i) => [
                'label'         => Carbon::now()->subDays($i)->format('D'),
                'date'          => Carbon::now()->subDays($i)->toDateString(),
                'form_messages' => 0,
                'user_messages' => 0,
            ])->values()->toArray();
        }
    }

    // ── Combined Stats ─────────────────────────────────────────────────────────

    /**
     * Master method — returns all dashboard data in a single call.
     *
     * Shape:
     * {
     *   form_messages:    { total, unread, counts: {...} },
     *   user_messages:    { total, this_week },
     *   content_sections: { total, last_updated },
     *   weekly_activity:  [ { label, date, form_messages, user_messages }, … ]
     * }
     */
    public function getAllStats(): array
    {
        return [
            'form_messages'    => $this->getFormMessageStats(),
            'user_messages'    => $this->getUserMessageStats(),
            'content_sections' => $this->getContentSectionStats(),
            'weekly_activity'  => $this->getWeeklyActivity(),
        ];
    }
}
