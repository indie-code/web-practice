<?php


namespace App\Http\Controllers;


use App\Attachment;
use App\Components\FFMpegService;
use App\Exceptions\VideoNotFoundException;
use App\Http\Resources\AttachmentResource;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Storage;

class VideoFilesController extends Controller
{
    public function store(Request $request, FFMpegService $ffmpegService)
    {
        $this->authorize('upload', Attachment::class);
        /**
         * @var UploadedFile $file
         */
        $file = $request->file;
        $file->store('', ['disk' => 'videos']);
        $fileName = $file->hashName();

        /**
         * @var $attachment Attachment
         */
        $attachment = auth()->user()->attachments()->create([
            'file_name' => $fileName,
            'mime_type' => $file->getClientMimeType(),
            'url' => url('videos/' . $fileName),
        ]);

        $thumbName = mb_substr($fileName, 0, - strlen($file->getClientOriginalExtension()) - 1);
        $thumbnails = $ffmpegService->makeThumbnails($fileName, $thumbName);

        $attachment->thumbnails()->saveMany($thumbnails);

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
