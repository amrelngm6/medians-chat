<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;

class FilesController extends Controller
{
    public function __construct(private readonly FileService $fileService) {}

    /**
     * List files in the specified directory.
     *  
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function list(Request $request)
    {
        $this->hasAccess();
        $path = $request->input('path', '/');
        $files = $this->fileService->listFiles($path);
        return new JsonResponse(['entries' => $files]);
    }
    

    /**
     * Display the home page.
     *
     * @return \Illuminate\View\View
     */
    public function upload(Request $request)
    {
        $this->hasAccess();
        
        if ($request->hasFile('files')) {
            try {
                $path = $this->fileService->uploadAndSaveFile($request->file('files'));
                return new JsonResponse(['success' => true, 'path' => $path]);
            } catch (\Exception $e) {
                return new JsonResponse(['success' => false, 'error' => $e->getMessage()], 400);
            }
        } else {
            return new JsonResponse(['success' => false, 'error' => 'No file uploaded'], 400);
        }
    }

    /**
     * Delete specified file.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Request $request)
    {
        $this->hasAccess();
        $path = $request->input('path');
        if (!$path) {
            return new JsonResponse(['success' => false, 'error' => 'Path parameter is required'], 400);
        }

        $deleted = $this->fileService->deleteFile($path);
        if ($deleted) {
            return new JsonResponse(['success' => true]);
        }

        return new JsonResponse(['success' => false, 'error' => 'File not found or could not be deleted'], 404);
    }
}
