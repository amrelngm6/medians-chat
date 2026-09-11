<?php

namespace App\Http\Requests;

use App\Models\FormMessage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFormMessageStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(FormMessage::STATUSES)],
        ];
    }
}
