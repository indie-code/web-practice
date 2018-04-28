<?php


namespace App\Http\Controllers;


use App\Attachment;
use App\Http\Requests\VideosSaveRequest;
use App\Http\Resources\VideoFullResource;
use App\Http\Resources\VideoResource;
use App\Video;
use Auth;

class VideosController extends Controller
{
    public function show(Video $video)
    {
        $this->authorize('show', $video);
        $video->load(['attachment.thumbnails', 'preview']);
        return new VideoResource($video);
    }
}
