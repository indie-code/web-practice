<?php


namespace App\Http\Controllers;


use App\Attachment;
use App\Http\Requests\VideosSaveRequest;
use App\Http\Resources\VideoResource;
use App\Video;
use Auth;

class UserVideosController extends Controller
{
    public function index()
    {
        return VideoResource::collection(Auth::user()->videos);
    }

    private function saveVideo(VideosSaveRequest $request, Video $video)
    {
        $video->fill($request->only(['title', 'description']));
        if ($request->filled('attachment_id')) {
            $attachment = Attachment::findOrFail($request->input('attachment_id'));
            $video->attachment()->save($attachment);
        }

        if ($request->filled('preview_id')) {
            $video->preview()->associate($request->input('preview_id'));
        }

        $video->save();

        $video->load(['attachment.thumbnails', 'preview']);

        return new VideoResource($video);
    }

    public function store(VideosSaveRequest $request)
    {
        /** @var Video $video */
        $video = Auth::user()->videos()->create($request->only([
            'title',
            'description',
        ]));

        return $this->saveVideo($request, $video);
    }

    public function update(VideosSaveRequest $request, Video $video)
    {
        return $this->saveVideo($request, $video);
    }
}
