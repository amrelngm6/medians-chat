<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ── General ──────────────────────────────────────────────────────
            [
                'group'       => 'general',
                'key'         => 'general.app_name',
                'label'       => 'Application Name',
                'value'       => 'Medians Chat',
                'type'        => 'text',
                'description' => 'The name displayed across the application.',
                'is_public'   => true,
                'sort_order'  => 1,
            ],
            [
                'group'       => 'general',
                'key'         => 'general.theme_color',
                'label'       => 'Theme color',
                'value'       => 'theme-dark',
                'type'        => 'select',
                'options'     => json_encode(['theme-red', 'theme-teal', 'theme-gold', 'theme-cyan', 'theme-blue', 'theme-violet', 'theme-pink', 'theme-green', 'theme-orange', 'theme-dark', 'multicolors']),
                'description' => 'Set the website default theme colors',
                'is_public'   => false,
                'sort_order'  => 4,
            ],
            [
                'group'       => 'general',
                'key'         => 'general.maintenance_mode',
                'label'       => 'Maintenance Mode',
                'value'       => '0',
                'type'        => 'boolean',
                'description' => 'Put the application in maintenance mode.',
                'is_public'   => false,
                'sort_order'  => 4,
            ],

            // ── Email ─────────────────────────────────────────────────────────
            [
                'group'       => 'email',
                'key'         => 'email.from_name',
                'label'       => 'From Name',
                'value'       => 'Medians',
                'type'        => 'text',
                'description' => 'The sender name used in outgoing emails.',
                'is_public'   => false,
                'sort_order'  => 1,
            ],
            [
                'group'       => 'email',
                'key'         => 'email.from_address',
                'label'       => 'From Address',
                'value'       => 'info@medians.tech',
                'type'        => 'text',
                'description' => 'The sender email address for outgoing emails.',
                'is_public'   => false,
                'sort_order'  => 2,
            ],
            [
                'group'       => 'email',
                'key'         => 'email.driver',
                'label'       => 'Mail Driver',
                'value'       => 'smtp',
                'type'        => 'select',
                'options'     => json_encode(['smtp', 'sendmail', 'mailgun', 'ses', 'log', 'array']),
                'description' => 'The transport driver used to send emails.',
                'is_public'   => false,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'email',
                'key'         => 'email.smtp_host',
                'label'       => 'SMTP Host',
                'value'       => 'mail.medians.tech',
                'type'        => 'text',
                'description' => 'The SMTP server hostname.',
                'is_public'   => false,
                'sort_order'  => 4,
            ],
            [
                'group'       => 'email',
                'key'         => 'email.smtp_port',
                'label'       => 'SMTP Port',
                'value'       => '587',
                'type'        => 'integer',
                'description' => 'The SMTP server port.',
                'is_public'   => false,
                'sort_order'  => 5,
            ],

            // ── SEO ──────────────────────────────────────────────────────
            [
                'group'       => 'seo',
                'key'         => 'seo.site_title',
                'label'       => 'Site Title',
                'value'       => 'AI Developer',
                'type'        => 'text',
                'description' => 'The title displayed in the browser tab and search engine results.',
                'is_public'   => true,
                'sort_order'  => 1,
            ],
            [
                'group'       => 'seo',
                'key'         => 'seo.meta_description',
                'label'       => 'Meta Description',
                'value'       => 'AI Developer - Your go-to platform for AI development.',
                'type'        => 'textarea',
                'description' => 'The meta description for search engines.',
                'is_public'   => true,
                'sort_order'  => 2,
            ],
            [
                'group'       => 'seo',
                'key'         => 'seo.meta_keywords',
                'label'       => 'Meta Keywords',
                'value'       => 'AI, Developer, Platform',
                'type'        => 'text',
                'description' => 'The meta keywords for search engines.',
                'is_public'   => true,
                'sort_order'  => 3,
            ],

            // ── Site ──────────────────────────────────────────────────────────
            [
                'group'       => 'site',
                'key'         => 'site.footer_text',
                'label'       => 'Footer Text',
                'value'       => 'Chat mode : Try browsing the website in chat mode instead of the normal scrolling.',
                'type'        => 'text',
                'description' => 'This text displayed at the website footer.',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.vertical_text_left',
                'label'       => 'Vertical Text (Left)',
                'value'       => 'AMR EWIS',
                'type'        => 'text',
                'description' => 'This text displayed at the left side of the website.',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.vertical_text_right',
                'label'       => 'Vertical Text (Right)',
                'value'       => 'MEDIANS',
                'type'        => 'text',
                'description' => 'This text displayed at the right side of the website.',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.chat_avatar',
                'label'       => 'Chat Avatar ',
                'value'       => '/storage/uploads/946f116c-0030-4546-81e4-31d0da233ac2.png',
                'type'        => 'file',
                'description' => 'The chat avatar at the chat-box',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.show_languages',
                'label'       => 'Show Language switcher',
                'value'       => '1',
                'type'        => 'boolean',
                'description' => 'Display or Hide the language switcher at the website',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.show_dark_mode',
                'label'       => 'Show Dark mode switch',
                'value'       => '1',
                'type'        => 'boolean',
                'description' => 'Display or Hide the dark mode switcher at the website',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.allow_speech_text',
                'label'       => 'Allow speech to text',
                'value'       => '1',
                'type'        => 'boolean',
                'description' => 'Display or Hide the microphone icon to allow the Speech to Text feature',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.show_color_switcher',
                'label'       => 'Show Theme Color switcher',
                'value'       => '1',
                'type'        => 'boolean',
                'description' => 'Display or Hide the theme colors switcher at the website',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
            [
                'group'       => 'site',
                'key'         => 'site.show_footer_menu',
                'label'       => 'Show Menu at the footer',
                'value'       => '1',
                'type'        => 'boolean',
                'description' => 'Display or Hide the Footer Menu',
                'is_public'   => true,
                'sort_order'  => 3,
            ],

            // ── Admin ─────────────────────────────────────────────────────────
            [
                'group'       => 'admin',
                'key'         => 'admin.show_pages_at_menu',
                'label'       => 'Show Content sections at Admin Side Menu',
                'value'       => '1',
                'type'        => 'boolean',
                'description' => 'Display or Hide the Content pages/sections at Admin Side Menu',
                'is_public'   => true,
                'sort_order'  => 3,
            ],
        ];

        foreach ($settings as $data) {
            Setting::updateOrCreate(
                ['key' => $data['key']],
                $data
            );
        }
    }
}
