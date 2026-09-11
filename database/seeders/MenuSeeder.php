<?php

namespace Database\Seeders;

use App\Models\HomeMenu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $menu = [
            [
                'title' => 'Services',
                'icon' => NULL,
                'url' => 'Services',
                'target' => '_self',
                'sort_order' => '4',
                'is_active' => '1',
                'parent_id' => NULL,
            ],
            [
                'title' => 'Contact',
                'icon' => NULL,
                'url' => 'Contact',
                'target' => '_self',
                'sort_order' => '5',
                'is_active' => '1',
                'parent_id' => NULL,
            ],
            [
                'title' => 'About',
                'icon' => NULL,
                'url' => 'About Amr',
                'target' => '_self',
                'sort_order' => '1',
                'is_active' => '0',
                'parent_id' => NULL,
            ],
            [
                'title' => 'Skills',
                'icon' => NULL,
                'url' => 'Skills',
                'target' => '_self',
                'sort_order' => '2',
                'is_active' => '1',
                'parent_id' => NULL,
            ],
            [
                'title' => 'Send Message',
                'icon' => NULL,
                'url' => 'open_contact_form',
                'target' => '_self',
                'sort_order' => '10',
                'is_active' => '1',
                'parent_id' => NULL,
            ],
        ];

        foreach ($menu as $data) {
            HomeMenu::create(
                $data
            );
        }
    }
}