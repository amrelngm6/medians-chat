<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        // return $this->user()?->can('manage settings') ?? false;
        return true;
    }

    public function rules(): array
    {
        return [
            'settings'   => ['required', 'array'],
            'settings.*' => ['present'],     // each value may be null / empty
        ];
    }

    public function messages(): array
    {
        return [
            'settings.required' => 'No settings were supplied.',
            'settings.array'    => 'Settings must be a key-value map.',
        ];
    }
}
