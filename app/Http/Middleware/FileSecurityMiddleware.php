<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class FileSecurityMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for suspicious patterns in file-related parameters
        $this->validateFileParameters($request);
        
        // Add security headers for file responses
        $response = $next($request);
        
        // Add security headers if this is a file download
        if ($this->isFileDownload($request)) {
            $this->addSecurityHeaders($response);
        }
        
        return $response;
    }
    
    /**
     * Validate file-related parameters for security threats
     *
     * @param Request $request
     * @throws \Symfony\Component\HttpKernel\Exception\BadRequestHttpException
     */
    protected function validateFileParameters(Request $request): void
    {
        $dangerousPatterns = [
            '../', '..\\', '../', '..\\',
            '%2e%2e%2f', '%2e%2e%5c',
            '..%2f', '..%5c',
            '%252e%252e%252f',
            '\0', '%00'
        ];
        
        // Check all request parameters
        foreach ($request->all() as $key => $value) {
            if (is_string($value)) {
                foreach ($dangerousPatterns as $pattern) {
                    if (stripos($value, $pattern) !== false) {
                        Log::warning('Suspicious file parameter detected', [
                            'ip' => $request->ip(),
                            'user_agent' => $request->userAgent(),
                            'parameter' => $key,
                            'value' => $value,
                            'pattern' => $pattern,
                            'url' => $request->fullUrl()
                        ]);
                        
                        abort(400, 'Invalid file parameter detected');
                    }
                }
            }
        }
        
        // Check URL path segments
        foreach ($request->segments() as $segment) {
            foreach ($dangerousPatterns as $pattern) {
                if (stripos($segment, $pattern) !== false) {
                    Log::warning('Suspicious URL segment detected', [
                        'ip' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                        'segment' => $segment,
                        'pattern' => $pattern,
                        'url' => $request->fullUrl()
                    ]);
                    
                    abort(400, 'Invalid URL segment detected');
                }
            }
        }
    }
    
    /**
     * Check if this is a file download request
     *
     * @param Request $request
     * @return bool
     */
    protected function isFileDownload(Request $request): bool
    {
        $fileEndpoints = [
            'download', 'file', 'attachment', 'export',
            'uploads', 'documents', 'storage'
        ];
        
        $path = $request->path();
        
        foreach ($fileEndpoints as $endpoint) {
            if (stripos($path, $endpoint) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Add security headers to file responses
     *
     * @param Response $response
     */
    protected function addSecurityHeaders(Response $response): void
    {
        $securityHeaders = config('file_security.security_headers', [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Content-Security-Policy' => "default-src 'none'; style-src 'unsafe-inline'; sandbox"
        ]);
        
        foreach ($securityHeaders as $header => $value) {
            $response->headers->set($header, $value);
        }
    }
}
