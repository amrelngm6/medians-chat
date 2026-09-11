<?php

namespace App\Http\Middleware;
 
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
 
class UpdateLastActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($user = auth()->user()) {
            // $user->timestamps    = false;
            // $user->last_activity = now()->getTimestamp();
            $user->saveQuietly();
        }
 
        return $next($request);
    }
}