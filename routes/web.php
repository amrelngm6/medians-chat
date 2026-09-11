<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers as Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

// Main route for the front homepage
Route::inertia('/login', 'admin/auth/LoginPage')->name('login');

Route::prefix('/api/v1')->group(function() {
    Route::post('/auth/login', [Controllers\AuthController::class, 'login']);
    // In routes/web.php, line 13-14:
    Route::post('/send-prompt', [Controllers\UserMessageController::class, 'store'])->middleware('throttle:20,1')->name('send-prompt');
    Route::post('/send-message', [Controllers\FormMessageController::class, 'subm   it'])->middleware('throttle:10,1')->name('send-message');

    Route::post('/set-locale', function(Request $request) {
        $locale = $request->get('locale', session('locale', config('app.locale')));
        session(['locale' => $locale]);
        Session::put('locale', $locale);
        return response()->json(['locale' => $locale]);
    })->name('set-locale');
});



Route::prefix('/admin')->middleware(['auth'])->group(function() {
    Route::inertia('/', 'admin/DashboardPage')->name('front-homepage');
    Route::inertia('/dashboard', 'admin/DashboardPage')->name('dashboard');
    Route::inertia('/users', 'admin/users/UsersPage')->name('users');
    Route::inertia('/home-menu', 'admin/menu/HomeMenuPage')->name('home-menu');

    Route::inertia('/pages', 'admin/content/ContentPages')->name('content-pages');

    Route::prefix('/content')->group(function() {
        Route::inertia('/', 'admin/content/ContentPage')->name('content');
        Route::inertia('/{any}', 'admin/content/ContentLayout')->name('content-page');
    });

    // Settings
    Route::inertia('/settings', 'admin/settings/GeneralSettingPage')->name('settings');
    Route::inertia('/settings/{any}', 'admin/settings/GeneralSettingPage')->name('settings.page');

    // Form Messages
    Route::inertia('/form-messages', 'admin/form_messages/FormMessagesPage')->name('form-messages');

    // User Messages
    Route::inertia('/user-messages', 'admin/user_messages/UserMessagesPage')->name('user-messages');

    // Media Library
    Route::inertia('/media', 'admin/media/MediaLibraryPage')->name('media');
});

// API routes for Version 1
Route::prefix('/api/v1')->group(function() {
        
    // Public content (read-only)
    Route::get('/content',      [Controllers\ContentController::class, 'index']);
    Route::get('/content/{key}', [Controllers\ContentController::class, 'show']);

    // Public Home Menus (read-only)
    Route::get('/home-menus',      [Controllers\HomeMenuController::class, 'index']);
    Route::get('/active-menu', [Controllers\HomeMenuController::class, 'active']);
    Route::get('/home-menus/{id}', [Controllers\HomeMenuController::class, 'show']);

    // ── Authenticated ───────────────────────────────────────────────────────────
    Route::middleware(['auth'])->group(function () {

        // Admin Menu (read-only)
        Route::get('/admin-menu',      [Controllers\AdminMenuController::class, 'index']);

        // Dashboard stats
        Route::get('/dashboard/stats', [Controllers\DashboardController::class, 'stats']);
        
        // Home Menus (write)
        Route::post('/home-menus',         [Controllers\HomeMenuController::class, 'store']);
        Route::put('/home-menus/{id}',     [Controllers\HomeMenuController::class, 'update']);
        Route::delete('/home-menus/{id}',  [Controllers\HomeMenuController::class, 'destroy']);

        // Auth
        Route::get('/auth/me',        [Controllers\AuthController::class, 'me']);
        Route::put('/auth/password',  [Controllers\AuthController::class, 'changePassword']);
        Route::post('/auth/logout',   [Controllers\AuthController::class, 'logout']);

        // Users
        Route::get('/users',                   [Controllers\UserController::class, 'index']);
        Route::post('/users',                  [Controllers\UserController::class, 'store']);
        Route::get('/users/{id}',              [Controllers\UserController::class, 'show']);
        Route::put('/users/{id}',              [Controllers\UserController::class, 'update']);
        Route::put('/users/{id}/password',     [Controllers\UserController::class, 'resetPassword']);
        Route::delete('/users/{id}',           [Controllers\UserController::class, 'destroy']);

        // Content (write — admin only, add your own middleware/policy)
        Route::put('/content/{key}', [Controllers\ContentController::class, 'update']);
        Route::post('/content/{key}', [Controllers\ContentController::class, 'update']);

        // File upload & management
        Route::get('/files', [Controllers\FilesController::class, 'list']);
        Route::post('/files/upload', [\App\Http\Controllers\FilesController::class, 'upload']);
        Route::delete('/files', [Controllers\FilesController::class, 'delete']);

        // Forms messages
        Route::prefix('form-messages')->name('form-messages.')->group(function () {
            Route::get('/',          [Controllers\FormMessageController::class, 'index'])->name('index');
            Route::post('/',         [Controllers\FormMessageController::class, 'store'])->name('store');
            Route::patch('/{id}/status', [Controllers\FormMessageController::class, 'updateStatus'])->name('status');
            Route::put('/{id}',      [Controllers\FormMessageController::class, 'update'])->name('update');
            Route::delete('/{id}',   [Controllers\FormMessageController::class, 'destroy'])->name('destroy');
        });

        // User Messages
        Route::prefix('user-messages')->name('user-messages.')->group(function () {
            Route::get('/',               [Controllers\UserMessageController::class, 'index'])->name('index');
            Route::get('/popular',        [Controllers\UserMessageController::class, 'popular'])->name('popular');
            Route::post('/',              [Controllers\UserMessageController::class, 'store'])->name('store');
            Route::get('/{id}',           [Controllers\UserMessageController::class, 'show'])->name('show');
            Route::put('/{id}',           [Controllers\UserMessageController::class, 'update'])->name('update');
            Route::delete('/{id}',        [Controllers\UserMessageController::class, 'destroy'])->name('destroy');
            Route::post('/{id}/restore',  [Controllers\UserMessageController::class, 'restore'])->name('restore');
            Route::delete('/{id}/force',  [Controllers\UserMessageController::class, 'forceDelete'])->name('force-delete');
        });
        
        // Settings
        Route::prefix('settings')->name('settings.')->group(function () {

            // List all settings grouped
            Route::get('/',          [Controllers\SettingController::class, 'index'])->name('index');

            // List available groups
            Route::get('/groups',    [Controllers\SettingController::class, 'groups'])->name('groups');

            // Settings for a single group
            Route::get('/groups/{group}',   [Controllers\SettingController::class, 'showGroup'])->name('show-group');

            // Bulk-save an entire group (or arbitrary keys)
            Route::put('/',          [Controllers\SettingController::class, 'bulkUpdate'])->name('bulk-update');

            // Save a single key
            Route::put('/{key}',     [Controllers\SettingController::class, 'update'])->name('update');
        });
    });
});


// ── Public ─────────────────────────────────────────────────────────────────
// Home page
Route::middleware(['web'])->group(function() {
    Route::get('/', [Controllers\HomeController::class, 'index']);
    Route::get('/{any}', [Controllers\HomeController::class, 'index']);
});