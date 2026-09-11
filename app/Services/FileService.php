<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileService
{
    private FileSecurityService $fileSecurityService;

    private string $folder = 'uploads';
    
    private array $allowedExtensions = ['jpg', 'png', 'gif', 'txt', 'pdf'];

    private string $diskType = 'public';

    public function __construct(FileSecurityService $fileSecurityService)
    {
        $this->fileSecurityService = $fileSecurityService;
    }


    /** 
     * Display List of files in the specified directory.
     * 
     * @param string $path The directory path to list files from
     * @return array The list of files in the specified directory
     */
    public function listFiles(string $path): array
    {
        // Sanitize the directory path before listing files
        $sanitizedFilename = $this->fileSecurityService->sanitizeFilename($this->folder.$path);
        
        $files = Storage::disk($this->diskType)->files($sanitizedFilename);
        $filesObject = [];
        foreach ($files as $key => $file) {

            $extension = pathinfo($file, PATHINFO_EXTENSION);

            if (!in_array($extension, $this->allowedExtensions)) {
                continue;
            }
            
            $files[$key] = basename($file);
            $files[$key] = [
                'name' => basename($file),
                'path' => $file,
                'type' => is_dir($file) ? 'directory' : 'file',
                'size' => Storage::disk($this->diskType)->size($file),
                'modified' => date('Y-m-d H:i:s', Storage::disk($this->diskType)->lastModified($file)),
                'permissions' => substr(sprintf('%o', fileperms(Storage::disk($this->diskType)->path($file))), -4),
            ];
        }

        return $files;
    }

    /**
     * Upload and Save file
     * @param UploadedFile $file
     * @return string The path where the file was saved
     */
    public function uploadAndSaveFile(UploadedFile $file): string
    {
        // Validate the file before saving
        $errors = $this->fileSecurityService->validateUploadSecurity($file);
        if (!empty($errors)) {
            throw new \Exception('File upload failed security validation: ' . implode(', ', $errors));
        }
        
        // Sanitize the filename before saving
        $sanitizedFilename = $this->fileSecurityService->sanitizeFilename($file->getClientOriginalName());

        // Determine the storage path for the sanitized file
        $path =  $this->folder . '/' . $sanitizedFilename;

        // Save the file to the designated folder
        Storage::disk($this->diskType)->putFileAs($this->folder, $file, $sanitizedFilename);
        
        return $path;
    }

    /**
     * Delete a file by path.
     * @param string $path Relative path to file
     * @return bool
     */
    public function deleteFile(string $path): bool
    {
        $sanitizedPath = ltrim($path, '/');
        if (Storage::disk($this->diskType)->exists($sanitizedPath)) {
            return Storage::disk($this->diskType)->delete($sanitizedPath);
        }
        return false;
    }
}
