<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'data'   => ['required', 'array'],
            'data.*' => ['nullable'],
            'sort_order' => ['optional', 'integer'],
        ];
    }
}
