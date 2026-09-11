<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Transforms a FormMessage model into a consistent JSON shape.
 * Used by every controller response so the React frontend
 * always receives the same structure.
 */
class FormMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'form_key'    => $this->form_key,
            'status'      => $this->status,

            // Sender
            'name'        => $this->name,
            'email'       => $this->email,
            'phone'       => $this->phone,
            'subject'     => $this->subject,
            'message'     => $this->message,
            'meta'        => $this->meta,

            // Reply
            'reply'       => $this->reply,
            'replied_at'  => $this->replied_at?->toIso8601String(),

            // Relationships (only when loaded)
            'user'        => $this->whenLoaded('user', fn () => [
                'id'    => $this->user->id,
                'name'  => trim("{$this->user->first_name} {$this->user->last_name}"),
                'email' => $this->user->email,
            ]),
            'handler'     => $this->whenLoaded('handler', fn () => [
                'id'    => $this->handler->id,
                'name'  => trim("{$this->handler->first_name} {$this->handler->last_name}"),
                'email' => $this->handler->email,
            ]),

            // Timestamps
            'read_at'     => $this->read_at?->toIso8601String(),
            'created_at'  => $this->created_at->toIso8601String(),
            'updated_at'  => $this->updated_at->toIso8601String(),
        ];
    }
}
