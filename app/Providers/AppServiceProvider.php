<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Schema::defaultStringLength(191);

        // During setup, configure session handling properly
        if (!env('MEDIANS_INSTALLED')) {
            // Ensure sessions work properly during setup
            $this->app->afterResolving('session', function ($session) {
                if (!$session->isStarted()) {
                    $session->start();
                }
            });
        }
    }
}
