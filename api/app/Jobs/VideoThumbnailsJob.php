<?php

namespace App\Jobs;

use App\Attachment;
use App\Components\FFMpegService;
use App\Events\ThumbnailsCreated;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class VideoThumbnailsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * @var Attachment
     */
    public $attachment;

    public function __construct(Attachment $attachment)
    {
        $this->attachment = $attachment;
    }

    public function handle(FFMpegService $ffMpegService)
    {
        $thumbName = preg_replace('/\.[^\.]+$/', '', $this->attachment->file_name);
        $thumbnails = $ffMpegService->makeThumbnails($this->attachment->file_name, $thumbName);
        $thumbnails->each(function (Attachment $attachment) {
            $attachment->user_id = $this->attachment->user_id;
        });
        $this->attachment->thumbnails()->saveMany($thumbnails);
        $this->attachment->load('thumbnails');

        event(new ThumbnailsCreated($this->attachment->id, $thumbnails));
    }
}
