<?php

namespace App\Http\Resources;

use App\Attachment;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'user' => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'permissions' => [
                    'attachments' => [
                        'upload' => $this->can('upload', Attachment::class),
                    ],
                ],
            ],
        ];
    }
}
