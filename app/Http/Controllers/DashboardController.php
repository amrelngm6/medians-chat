<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $service,
    ) {}

    /**
     * GET /api/v1/dashboard/stats
     *
     * Returns aggregated stats for the admin dashboard.
     *
     * Response shape:
     * {
     *   success: true,
     *   data: {
     *     form_messages:    { total, unread, counts: { new, read, replied, archived, spam } },
     *     user_messages:    { total, this_week },
     *     content_sections: { total, last_updated },
     *     weekly_activity:  [ { label, date, form_messages, user_messages } × 7 ]
     *   }
     * }
     */
    public function stats(): JsonResponse
    {
        $data = $this->service->getAllStats();

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
