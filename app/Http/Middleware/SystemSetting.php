<?php namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;
use Closure;

class SystemSetting extends BaseVerifier
{
  
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'settings/*',
        'settings',
        'settings/*/*',
        'settings/*/*/*',
        'settings/*/*/*/*',
        'settings/*/*/*/*/*',
    ];

    /**
     * This url should share the business settings with all views   
     * 
     */
    public function handle($request, \Closure $next)
    {
        $user = auth()->user();

        if (!$user) {
            return $next($request);
        }

        // Fetch all settings
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        // Share settings with all views
        \View::share('systemSettings', $settings);
        
        // Store settings in the config
        config(['app.systemSettings' => $settings]);
        
        return parent::handle($request, $next);
    }
}