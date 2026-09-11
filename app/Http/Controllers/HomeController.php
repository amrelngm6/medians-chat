<?php

namespace App\Http\Controllers;

use App\Services\ContentService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __construct(private readonly ContentService $contentService) {}

    /**
     * Display the home page.
     *
     * @return \Illuminate\View\View
     */
    public function index(Request $request)
    {
        $locale = $request->get('set-locale', session('locale', config('app.locale')));
        
        $content = $this->contentService->getAll($locale);

        $setting = \App\Models\Setting::pluck('value', 'key')->toArray();

        return view('home', compact('content', 'setting', 'locale'));
    }
}
