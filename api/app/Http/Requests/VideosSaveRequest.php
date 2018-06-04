<?php

namespace App\Http\Requests;

use App\Attachment;
use App\Video;
use Illuminate\Foundation\Http\FormRequest;

class VideosSaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $attachment = Attachment::find($this->input('attachment_id'));

        if (
            $this->filled('attachment_id') &&
            $attachment &&
            auth()->user()->cant('attach', $attachment)
        ) {
            return false;
        }

        return auth()->user()->can('store', Video::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'nullable|max:255',
            'attachment_id' => 'nullable|exists:attachments,id',
            'preview_id' => 'nullable|exists:attachments,id',
        ];
    }
}
