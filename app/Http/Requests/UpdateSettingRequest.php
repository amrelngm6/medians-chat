<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Adjust to your auth / permission system.
        // return $this->user()?->can('manage settings') ?? false;
        return true;
    }

    public function rules(): array
    {
        return [
            'value' => ['present'],          // value may be null / empty string
        ];
    }
}
