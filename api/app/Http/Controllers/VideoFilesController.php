<?php


namespace App\Http\Controllers;


use App\Attachment;
use App\Exceptions\VideoNotFoundException;
use App\Http\Resources\AttachmentResource;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Storage;

class VideoFilesController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('upload', Attachment::class);
        /**
         * @var UploadedFile $file
         */
        $file = $request->file;
        $file->store('', ['disk' => 'videos']);
        $attachment = auth()->user()->attachments()->create([
            'file_name' => $file->hashName(),
            'mime_type' => $file->getClientMimeType(),
        ]);

        return new AttachmentResource($attachment);
    }

    public function show($videoFile)
    {
        if (! Storage::disk('videos')->exists($videoFile)) {
            throw new VideoNotFoundException("Видео не найдено");
        }

        $mime = Storage::disk('videos')->mimeType($videoFile);

        return response('', 200, [
            'X-Accel-Redirect' => "/videos/{$videoFile}",
            'Content-Type' => $mime,
        ]);
    }
}
