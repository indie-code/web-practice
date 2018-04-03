<?php


namespace App\Http\Controllers;


use App\Attachment;
use App\Http\Requests\VideosStoreRequest;
use App\Http\Resources\VideoResource;
use App\Video;
use Auth;

class UserVideosController extends Controller
{
    public function index()
    {
        return VideoResource::collection(Auth::user()->videos);
    }

    public function store(VideosStoreRequest $request)
    {
        /** @var Video $video */
        $video = Auth::user()->videos()->create($request->only([
            'title',
            'description',
        ]));

        if ($request->filled('attachment_id')) {
            $attachment = Attachment::findOrFail($request->input('attachment_id'));
            $video->attachment()->save($attachment);
        }

        return new VideoResource($video);

    }

    public function update()
    {
        //
    }

    public function show()
    {
        //
    }
}
