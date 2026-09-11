<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkUpdateSettingsRequest;
use App\Http\Requests\UpdateSettingRequest;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct(private readonly SettingService $service) {}

    /**
     * GET /api/settings
     * All settings grouped by their group slug.
     */
    public function index(): JsonResponse
    {
        $grouped = $this->service->getGrouped();

        asort($grouped);
        
        return response()->json([
            'data' => $grouped,
        ]);
    }

    /**
     * GET /api/settings/groups
     * List of group metadata (name, label, count).
     */
    public function groups(): JsonResponse
    {
        $groups = $this->service->getGroups();
        return response()->json([
            'data' => $groups,
        ]);
    }

    /**
     * GET /api/settings/{group}
     * All settings in a single group.
     */
    public function showGroup(string $group): JsonResponse
    {
        return response()->json([
            'data' => $this->service->getGroup($group),
            'meta' => $this->service->getGroupMeta($group),
        ]);
    }

    /**
     * PUT /api/settings/{key}
     * Update a single setting.
     */
    public function update(UpdateSettingRequest $request, string $key): JsonResponse
    {
        $setting = $this->service->update($key, $request->validated('value'));

        return response()->json([
            'message' => 'Setting updated.',
            'data'    => $setting,
        ]);
    }

    /**
     * PUT /api/settings
     * Bulk-update many settings in one request.
     */
    public function bulkUpdate(BulkUpdateSettingsRequest $request): JsonResponse
    {
        $this->service->bulkUpdate($request->validated('settings'));

        return response()->json([
            'message' => 'Settings saved.',
        ]);
    }
}
