<?php


namespace App\Http\Controllers;


use App\Attachment;
use App\Http\Resources\AttachmentResource;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class AttachmentsController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('upload', Attachment::class);
        /**
         * @var UploadedFile $file
         */
        $file = $request->file;
        $file->store('');
        $attachment = auth()->user()->attachments()->create([
            'file_name' => $file->hashName(),
            'mime_type' => $file->getClientMimeType(),
        ]);

        return new AttachmentResource($attachment);
    }
}
