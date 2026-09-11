<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddMessageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'role'            => ['required', 'string', Rule::in(['user', 'assistant', 'system'])],
            'content'         => ['required', 'string'],
            'file_references' => ['sometimes', 'nullable', 'array'],
            'token_count'     => ['sometimes', 'nullable', 'integer', 'min:0'],
        ];
    }
}
