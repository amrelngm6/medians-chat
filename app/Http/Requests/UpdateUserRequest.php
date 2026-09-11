<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'email'      => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($this->route('id'))],
            'status'     => ['sometimes', 'string', Rule::in(['active', 'inactive', 'suspended'])],
        ];
    }
}
