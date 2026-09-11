<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMenuController extends Controller
{

    /**
     * GET /api/v1/admin-menus
     * Returns list or tree of home menu items.
     */
    public function index(Request $request): JsonResponse
    {

        $setting = \App\Models\Setting::pluck('value', 'key')->toArray();
        $contentMenu = !empty($setting['admin.show_pages_at_menu'])  ? $this->getContentMenu() : [];
    
        return response()->json([
            "success"=> true,
            "data" => [
                "Dashboard" => [
                    "icon" => "LayoutDashboard",
                    "items" =>[
                        [
                            "title" => "Dashboard",
                            "url" => "/admin/dashboard",
                            "icon" => "LayoutDashboard",
                        ],
                    ],
                ],
                

                "Contacts" => [
                    "icon" => "LayoutDashboard",
                    "items" =>
                    [
                        [
                            "title" => "Form Messages",
                            "url" => "/admin/form-messages",
                            "icon" => "Contact",
                        ],
                        [
                            "title" => "User Messages",
                            "url" => "/admin/user-messages",
                            "icon" => "MessageCircle",
                        ],
                    ],
                ],

                ...$contentMenu,
                
                "Content & Menu" => [
                    "icon" => "LayoutDashboard",
                    "items" =>
                    [
                        [
                            "title" => "Pages",
                            "url" => "/admin/pages",
                            "icon" => "FileText",
                        ],
                        [
                            "title" => "Home Menu",
                            "url" => "/admin/home-menu",
                            "icon" => "Menu",
                        ],
                    ]
                ],

                
                "Media & Files" => [
                    "icon" => "LayoutDashboard",
                    "items" =>
                    [
                        [
                            "title" => "Media Library",
                            "url" => "/admin/media",
                            "icon" => "Image",
                        ]
                    ],
                ],
                "Settings" => [
                    "icon" => "LayoutDashboard",
                    "items" => [
                        [
                            "title" => "General Settings",
                            "url" => "/admin/settings/general",
                            "icon" => "Settings",
                        ],
                        [
                            "title" => "Site Settings",
                            "url" => "/admin/settings/site",
                            "icon" => "Settings",
                        ],
                        [
                            "title" => "Email Settings",
                            "url" => "/admin/settings/email",
                            "icon" => "Send",
                        ],
                        [
                            "title" => "SEO Settings",
                            "url" => "/admin/settings/seo",
                            "icon" => "SEO",
                        ],
                        [
                            "title" => "Admin Settings",
                            "url" => "/admin/settings/admin",
                            "icon" => "ShieldCheck",
                        ],
                    ]
                ],
                "Users" => [    
                    "icon" => "LayoutDashboard",
                    "items" =>
                    [
                        [
                            "title" => "Users",
                            "url" => "/admin/users",
                            "icon" => "Users",
                        ]
                    ]
                ],
                
            ]
        ]);
    }


    /**
     * Get the content menu
     * 
     */
    public function getContentMenu()
    {
        $service = app('\App\Services\ContentService');

        $list = $service->getAll();

        $data = [];

        $i = 0;
        foreach ($list as $key => $value) {
            // You can perform any additional processing here if needed
            $data[$i] = [
                "title" => ucfirst($key),
                "url" => '/admin/content/' . $key,
                "icon" => "ListTree",
            ];
            $i++;
        }

        return [
            "Content Sections" => [
                "icon" => "LayoutDashboard",
                "items" => $data,
            ]
        ];
        
    }
    
}
