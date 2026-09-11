<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReplyFormMessageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'reply' => ['required', 'string', 'min:5', 'max:10000'],
        ];
    }
}
