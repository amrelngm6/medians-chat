<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Public-facing submission — no auth required.
 * Used by the React contact / support form.
 */
class SubmitFormMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // public endpoint
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:150'],
            'email'    => ['required', 'email', 'max:255'],
            'phone'    => ['sometimes', 'nullable', 'string', 'max:30'],
            'subject'  => ['sometimes', 'nullable', 'string', 'max:255'],
            'message'  => ['required', 'string', 'min:10', 'max:5000'],
            'form_key' => ['sometimes', 'string', 'max:50'],
            'meta'     => ['sometimes', 'nullable', 'array'],
            'meta.*'   => ['nullable'],
        ];
    }
}
