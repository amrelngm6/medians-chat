<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // $middleware->statefulApi(); // adds EnsureFrontendRequestsAreStateful to the api group
        // Set Language based on URL
        // $middleware->web(append: \App\Http\Middleware\AuthMiddleware::class);
        $middleware->web(append: \App\Http\Middleware\SetLocale::class);
        $middleware->web(append: \App\Http\Middleware\SystemSetting::class);
        $middleware->web(append: \App\Http\Middleware\UpdateLastActivity::class);
        $middleware->web(append: \App\Http\Middleware\HandleInertiaRequests::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
