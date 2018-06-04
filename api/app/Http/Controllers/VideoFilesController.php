<?php

namespace App\Http\Controllers;

use App\Attachment;
use App\Components\UploadedFileService;
use App\Events\ChunkUploaded;
use App\Exceptions\VideoNotFoundException;
use App\Http\Resources\AttachmentResource;
use App\Jobs\VideoThumbnailsJob;
use App\Video;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Storage;

class VideoFilesController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('upload', Attachment::class);
        $this->validate($request, ['size' => 'required|integer']);

        /** @var $attachment Attachment */
        $fileName = str_random(40);
        $attachment = auth()->user()->attachments()->make([
            'file_name' => $fileName,
            'url' => route('video-files.show', $fileName),
            'size' => $request->input('size'),
        ]);

        if ($request->filled('video_id')) {
            $attachment->video()->associate(Video::findOrFail($request->input('video_id')));
        }

        $attachment->save();

        Storage::disk('videos')->put($attachment->file_name, '');

        return new AttachmentResource($attachment);
    }

    public function storeChunk(Request $request, UploadedFileService $fileService, Attachment $attachment)
    {
        $this->authorize('uploadChunk', [$attachment]);
        $this->validate($request, [
            'start' => 'required|integer',
            'file' => 'required|file',
        ]);

        /** @var UploadedFile $file */
        $file = $request->file;
        $fileName = Storage::disk('videos')->path($attachment->file_name);
        $newFile = $fileService->writeChunk($fileName, $file, $request->input('start'));

        $attachment->incrementUploadedSize($file->getSize());
        event(new ChunkUploaded($attachment));

        if ($attachment->isUploaded()) {
            $finishFileName = "{$newFile->getFilename()}.{$newFile->guessExtension()}";
            $mimeType = $newFile->getMimeType();
            $newFile->move($newFile->getPath(), $finishFileName);
            $attachment->update([
                'mime_type' => $mimeType,
                'file_name' => $finishFileName,
                'url' => route('video-files.show', $finishFileName),
            ]);

            $this->dispatch(new VideoThumbnailsJob($attachment));
        }

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

    public function uploading()
    {
        $this->authorize('upload', Attachment::class);
        $attachments = Auth::user()->attachments()
            ->with('video')
            ->whereColumn('uploaded_size','<', 'size')
            ->where('updated_at', '>', now()->subMinutes(2))
            ->get()
        ;

        return AttachmentResource::collection($attachments);
    }
}
