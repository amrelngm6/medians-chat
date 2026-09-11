<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeMenuRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'      => ['sometimes', 'required', 'string', 'max:255'],
            'icon'       => ['nullable', 'string', 'max:255'],
            'url'        => ['nullable', 'string', 'max:500'],
            'target'     => ['nullable', 'string', 'max:50'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active'  => ['sometimes', 'boolean'],
            'parent_id'  => ['nullable', 'string', 'uuid', 'exists:home_menus,id'],
        ];
    }
}
