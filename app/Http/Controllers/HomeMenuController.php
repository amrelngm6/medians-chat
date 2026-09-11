<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateHomeMenuRequest;
use App\Http\Requests\UpdateHomeMenuRequest;
use App\Services\HomeMenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeMenuController extends Controller
{
    public function __construct(private readonly HomeMenuService $homeMenuService) {}

    /**
     * GET /api/v1/home-menus
     * Returns list or tree of home menu items.
     */
    public function index(Request $request): JsonResponse
    {
        $asTree     = $request->boolean('tree', false);
        $onlyActive = $request->boolean('active_only', false);

        $items = $asTree 
            ? $this->homeMenuService->getTree($onlyActive)
            : $this->homeMenuService->getAll($onlyActive);

        return response()->json([
            'success' => true,
            'data'    => $items,
        ]);
    }

    /**
     * GET /api/v1/home-menus/{id}
     */
    public function show(string $id): JsonResponse
    {
        $menu = $this->homeMenuService->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $menu->load('children'),
        ]);
    }

    /**
     * POST /api/v1/home-menus
     */
    public function store(CreateHomeMenuRequest $request): JsonResponse
    {
        $menu = $this->homeMenuService->create($request->validated());

        return response()->json([
            'success' => true,
            'data'    => $menu,
        ], 201);
    }

    /**
     * PUT /api/v1/home-menus/{id}
     */
    public function update(UpdateHomeMenuRequest $request, string $id): JsonResponse
    {
        $menu    = $this->homeMenuService->findOrFail($id);
        $updated = $this->homeMenuService->update($menu, $request->validated());

        return response()->json([
            'success' => true,
            'data'    => $updated,
        ]);
    }

    /**
     * DELETE /api/v1/home-menus/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $menu = $this->homeMenuService->findOrFail($id);
        $this->homeMenuService->delete($menu);

        return response()->json([
            'success' => true,
            'message' => 'Home menu item deleted successfully',
        ]);
    }

    /**
     * Get active home menu items.
     * @return JsonResponse
     */
    public function active(): JsonResponse
    {
        $items = $this->homeMenuService->getAll(true);

        return response()->json([
            'success' => true,
            'data'    => $items,
        ]);
    }
}
