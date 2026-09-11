<?php

namespace App\Services;

use App\Models\ContentSection;
use App\Models\ContentSectionTranslation;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ContentService
{
    /** Return all sections as key → data map. */
    public function getAll(string $locale = 'en'): array
    {
        $result = ContentSectionTranslation::query()
            ->join(
                'content_sections',
                'content_sections.id',
                '=',
                'content_section_translations.content_section_id'
            )
            ->with('section')
            ->where('content_section_translations.locale', $locale)
            ->orderBy('content_sections.sorting')
            ->select('content_section_translations.*')
            ->get()
            ->filter(fn (ContentSectionTranslation $translation) => $translation->section !== null)
            ->mapWithKeys(fn (ContentSectionTranslation $translation) => [
                $translation->section->section_key => $translation->data,
            ])
            ->toArray();

        return $result;
    }

    public function getByKey(string $key, string $locale = 'en'): ContentSectionTranslation
    {
        $section = ContentSectionTranslation::query()
            ->where('locale', $locale)
            ->whereHas('section', fn ($query) => $query->where('section_key', $key))
            ->first();

        if (! $section) {
            throw new ModelNotFoundException("Content section '{$key}' for locale '{$locale}' not found.");
        }

        return $section;
    }

    public function create(string $key, string $locale, array $data, int $sorting = 0): ContentSectionTranslation
    {
        return $this->update($key, $locale, $data, $sorting);
    }

    public function update(string $key, string $locale, array $data, int $sorting = 0): ContentSectionTranslation
    {
        $section = ContentSection::firstOrCreate(
            ['section_key' => $key],
            ['sorting' => $sorting]
        );

        return ContentSectionTranslation::updateOrCreate(
            [
                'content_section_id' => $section->id,
                'locale' => $locale,
            ],
            ['data' => $data]
        );
    }
}
