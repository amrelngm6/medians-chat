<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateContentRequest;
use App\Services\ContentService;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function __construct(private readonly ContentService $contentService) {}

    /**
     * GET /content
     * React: contentApi.getAll()
     */
    public function index(): JsonResponse
    {
        $locale = request()->query('locale', 'en');

        return response()->json([
            'success' => true,
            'data'    => $this->contentService->getAll($locale),
        ]);
    }

    /**
     * GET /content/{key}
     * React: contentApi.getByKey(key)
     */
    public function show(string $key): JsonResponse
    {
        $locale = request()->query('locale', 'en');
        $section = $this->contentService->getByKey($key, $locale);

        return response()->json([
            'success' => true,
            'data'    => $section,
        ]);
    }

    /**
     * POST /content/{key}
     * React: contentApi.create(key, data)
     */
    public function create(UpdateContentRequest $request, string $key): JsonResponse
    {
        $locale = $request->query('locale', 'en');
        $section = $this->contentService->create($key, $locale, $request->validated('data'));

        return response()->json([
            'success' => true,
            'data'    => $section,
        ]);
    }

    /**
     * PUT /content/{key}
     * React: contentApi.update(key, data)
     */
    public function update(UpdateContentRequest $request, string $key): JsonResponse
    {
        $locale = $request->query('locale', 'en');
        $section = $this->contentService->update($key, $locale, $request->validated('data'));

        return response()->json([
            'success' => true,
            'data'    => $section,
        ]);
    }
}
