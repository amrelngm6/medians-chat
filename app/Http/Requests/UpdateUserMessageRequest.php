<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['sometimes', 'required', 'string'],
            'ip'      => ['sometimes', 'nullable', 'string', 'ip'],
            'browser' => ['sometimes', 'nullable', 'string', 'max:500'],
        ];
    }
}
