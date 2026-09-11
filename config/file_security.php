<?php

return [
    /*
    |--------------------------------------------------------------------------
    | File Security Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration file contains security settings for file uploads,
    | downloads, and access control to prevent path traversal attacks
    | and other file-related security vulnerabilities.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Allowed File Types
    |--------------------------------------------------------------------------
    |
    | Define allowed MIME types and file extensions for uploads.
    | Only files matching these types will be allowed.
    |
    */
    'allowed_mime_types' => [
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        
        // Text files
        'text/plain',
        'text/csv',
        'text/rtf',
        
        // Images
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        
        // Archives
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/gzip',
        
        // Audio/Video (if needed)
        'audio/mpeg',
        'audio/wav',
        'video/mp4',
        'video/avi',
    ],

    'allowed_extensions' => [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
        'txt', 'csv', 'rtf',
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg',
        'zip', 'rar', '7z', 'gz',
        'mp3', 'wav', 'mp4', 'avi'
    ],

    /*
    |--------------------------------------------------------------------------
    | File Size Limits
    |--------------------------------------------------------------------------
    |
    | Maximum file size in kilobytes for different file types.
    |
    */
    'max_file_size' => [
        'default' => 25600, // 25MB in KB
        'image' => 10240,   // 10MB for images
        'document' => 25600, // 25MB for documents
        'archive' => 51200,  // 50MB for archives
        'video' => 102400,   // 100MB for videos
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Upload Directories
    |--------------------------------------------------------------------------
    |
    | Define the allowed base directories where files can be stored.
    | All file paths must start with one of these directories.
    |
    */
    'allowed_upload_directories' => [
        'storage/app/public/files/',
        'storage/app/public/documents/',
        'storage/app/public/uploads/',
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Download Directories
    |--------------------------------------------------------------------------
    |
    | Define the allowed base directories from where files can be downloaded.
    | All download paths must start with one of these directories.
    |
    */
    'allowed_download_directories' => [
        'storage/app/public/files/',
        'storage/app/public/uploads/',
    ],

    /*
    |--------------------------------------------------------------------------
    | Filename Validation
    |--------------------------------------------------------------------------
    |
    | Regular expression pattern for validating filenames.
    | Only filenames matching this pattern will be allowed.
    |
    */
    'filename_pattern' => '/^[a-zA-Z0-9._-]+$/',

    /*
    |--------------------------------------------------------------------------
    | Path Traversal Protection
    |--------------------------------------------------------------------------
    |
    | List of dangerous patterns to remove from file paths
    | to prevent directory traversal attacks.
    |
    */
    'dangerous_patterns' => [
        '../',
        '..\\',
        '../',
        '..\\',
        "\0",        // Null byte
        '%00',       // URL encoded null byte
        '%2e%2e/',   // URL encoded ../
        '%2e%2e\\',  // URL encoded ..\
    ],

    /*
    |--------------------------------------------------------------------------
    | File Type Detection
    |--------------------------------------------------------------------------
    |
    | Configuration for file type detection methods.
    |
    */
    'detection' => [
        'use_mime_type' => true,
        'use_extension' => true,
        'strict_mode' => true, // Require both MIME type and extension to match
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Headers
    |--------------------------------------------------------------------------
    |
    | Headers to include when serving files to enhance security.
    |
    */
    'security_headers' => [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'Content-Security-Policy' => "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    ],

    /*
    |--------------------------------------------------------------------------
    | Quarantine Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for quarantining suspicious files.
    |
    */
    'quarantine' => [
        'enabled' => true,
        'directory' => 'storage/quarantine/',
        'max_retention_days' => 30,
    ],
];
