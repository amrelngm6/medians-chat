<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FileSecurityService
{
    /**
     * Validate file upload security
     *
     * @param UploadedFile $file
     * @return array
     */
    public function validateUploadSecurity(UploadedFile $file): array
    {
        $errors = [];

        // Check file size
        if (!$this->isValidFileSize($file)) {
            $errors[] = 'File size exceeds maximum allowed limit';
        }

        // Check MIME type
        if (!$this->isValidMimeType($file)) {
            $errors[] = 'File type is not allowed';
        }

        // Check file extension
        if (!$this->isValidExtension($file)) {
            $errors[] = 'File extension is not allowed';
        }

        // Check filename
        if (!$this->isValidFilename($file->getClientOriginalName())) {
            $errors[] = 'Invalid filename';
        }

        // Scan for malicious content (basic check)
        if (!$this->basicMalwareCheck($file)) {
            $errors[] = 'File appears to contain suspicious content';
        }

        return $errors;
    }

    /**
     * Sanitize file path to prevent directory traversal attacks
     *
     * @param string $path
     * @return string
     */
    public function sanitizeFilePath(string $path): string
    {
        // Remove dangerous patterns
        $dangerousPatterns = config('file_security.dangerous_patterns', [
            '../', '..\\', '../', '..\\', "\0", '%00', '%2e%2e/', '%2e%2e\\'
        ]);

        foreach ($dangerousPatterns as $pattern) {
            $path = str_replace($pattern, '', $path);
        }

        // Normalize path separators
        $path = str_replace('\\', '/', $path);

        // Remove leading slashes to prevent absolute path access
        $path = ltrim($path, '/');

        return $path;
    }

    /**
     * Sanitize filename to prevent various attacks
     *
     * @param string $filename
     * @return string
     */
    public function sanitizeFilename(string $filename): string
    {
        // Remove directory traversal patterns
        $filename = str_replace(['../', '..\\', '../', '..\\'], '', $filename);

        // Remove null bytes and control characters
        $filename = preg_replace('/[\x00-\x1f\x7f]/', '', $filename);

        // Remove path separators
        $filename = str_replace(['/', '\\'], '', $filename);

        // Remove potential script execution characters
        $filename = preg_replace('/[<>:"|?*]/', '', $filename);

        return $filename;
    }

    /**
     * Validate if file path is within allowed directories
     *
     * @param string $path
     * @param string $context (upload, download, etc.)
     * @return bool
     */
    public function isValidFilePath(string $path, string $context = 'download'): bool
    {
        $allowedDirectories = $context === 'upload' 
            ? config('file_security.allowed_upload_directories', [])
            : config('file_security.allowed_download_directories', []);

        // Sanitize the path first
        $normalizedPath = $this->sanitizeFilePath($path);

        // Check if path starts with any allowed directory
        foreach ($allowedDirectories as $allowedDir) {
            if (strpos($normalizedPath, $allowedDir) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if file size is within limits
     *
     * @param UploadedFile $file
     * @return bool
     */
    public function isValidFileSize(UploadedFile $file): bool
    {
        $maxSize = $this->getMaxFileSizeForType($file);
        return $file->getSize() <= ($maxSize * 1024); // Convert KB to bytes
    }

    /**
     * Check if MIME type is allowed
     *
     * @param UploadedFile $file
     * @return bool
     */
    public function isValidMimeType(UploadedFile $file): bool
    {
        $allowedMimeTypes = config('file_security.allowed_mime_types', []);
        return in_array($file->getMimeType(), $allowedMimeTypes);
    }

    /**
     * Check if file extension is allowed
     *
     * @param UploadedFile $file
     * @return bool
     */
    public function isValidExtension(UploadedFile $file): bool
    {
        $allowedExtensions = config('file_security.allowed_extensions', []);
        $extension = strtolower($file->getClientOriginalExtension());
        return in_array($extension, $allowedExtensions);
    }

    /**
     * Check if filename is valid
     *
     * @param string $filename
     * @return bool
     */
    public function isValidFilename(string $filename): bool
    {
        $pattern = config('file_security.filename_pattern', '/^[a-zA-Z0-9._-]+$/');
        return preg_match($pattern, $filename);
    }

    /**
     * Basic malware check (can be extended with more sophisticated scanning)
     *
     * @param UploadedFile $file
     * @return bool
     */
    public function basicMalwareCheck(UploadedFile $file): bool
    {
        // Check file size (extremely large files might be suspicious)
        if ($file->getSize() > 100 * 1024 * 1024) { // 100MB
            return false;
        }

        // Check for suspicious patterns in filename
        $suspiciousPatterns = [
            '\.exe$', '\.bat$', '\.cmd$', '\.scr$', '\.pif$',
            '\.vbs$', '\.js$', '\.jar$', '\.com$', '\.msi$'
        ];

        $filename = strtolower($file->getClientOriginalName());
        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match('/' . $pattern . '/i', $filename)) {
                Log::warning('Suspicious file upload attempt', [
                    'filename' => $filename,
                    'pattern' => $pattern,
                    'mime_type' => $file->getMimeType()
                ]);
                return false;
            }
        }

        return true;
    }

    /**
     * Get maximum file size for specific file type
     *
     * @param UploadedFile $file
     * @return int Size in KB
     */
    public function getMaxFileSizeForType(UploadedFile $file): int
    {
        $mimeType = $file->getMimeType();
        $maxSizes = config('file_security.max_file_size', []);

        if (strpos($mimeType, 'image/') === 0) {
            return $maxSizes['image'] ?? $maxSizes['default'] ?? 25600;
        }

        if (strpos($mimeType, 'video/') === 0) {
            return $maxSizes['video'] ?? $maxSizes['default'] ?? 25600;
        }

        if (in_array($mimeType, ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'])) {
            return $maxSizes['archive'] ?? $maxSizes['default'] ?? 25600;
        }

        return $maxSizes['document'] ?? $maxSizes['default'] ?? 25600;
    }

    /**
     * Generate secure filename
     *
     * @param string $originalName
     * @param string $prefix
     * @return string
     */
    public function generateSecureFilename(string $originalName, string $prefix = ''): string
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $timestamp = time();
        $random = bin2hex(random_bytes(8));
        
        $secureFilename = $prefix . $timestamp . '_' . $random;
        
        if ($extension) {
            $secureFilename .= '.' . $extension;
        }

        return $secureFilename;
    }

    /**
     * Quarantine suspicious file
     *
     * @param UploadedFile $file
     * @param string $reason
     * @return bool
     */
    public function quarantineFile(UploadedFile $file, string $reason): bool
    {
        if (!config('file_security.quarantine.enabled', false)) {
            return false;
        }

        try {
            $quarantineDir = config('file_security.quarantine.directory', 'storage/quarantine/');
            $filename = $this->generateSecureFilename($file->getClientOriginalName(), 'quarantine_');
            
            $file->storeAs($quarantineDir, $filename);
            
            Log::warning('File quarantined', [
                'original_filename' => $file->getClientOriginalName(),
                'quarantine_filename' => $filename,
                'reason' => $reason,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize()
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to quarantine file', [
                'filename' => $file->getClientOriginalName(),
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get security headers for file downloads
     *
     * @return array
     */
    public function getSecurityHeaders(): array
    {
        return config('file_security.security_headers', [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'Content-Security-Policy' => "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        ]);
    }

    /**
     * Check if file exists safely
     *
     * @param string $path
     * @param string $disk
     * @return bool
     */
    public function fileExistsSafely(string $path, string $disk = 'public'): bool
    {
        try {
            $sanitizedPath = $this->sanitizeFilePath($path);
            
            if (!$this->isValidFilePath($sanitizedPath)) {
                return false;
            }

            return Storage::disk($disk)->exists($sanitizedPath);
        } catch (\Exception $e) {
            Log::error('Error checking file existence', [
                'path' => $path,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
