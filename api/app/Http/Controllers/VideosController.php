<?php


namespace App\Http\Controllers;



use App\Http\Resources\VideoResource;
use App\Video;

class VideosController extends Controller
{
    public function show(Video $video)
    {
        $this->authorize('show', $video);
        $video->load(['attachment.thumbnails', 'preview']);
        return new VideoResource($video);
    }
}
