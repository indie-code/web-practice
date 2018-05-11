<?php

namespace App\Components;


use App\Attachment;
use FFMpeg;
use Illuminate\Support\Collection;

class FFMpegService
{
    const DEFAULT_THUMBNAILS_DURATIONS = [0.05, 0.5, 0.95];

    public function makeThumbnails($file_name, $thumb_name): Collection
    {
        $video = FFMpeg::fromDisk('videos')
            ->open($file_name);

        $duration = $video->getDurationInSeconds();

        return collect(self::DEFAULT_THUMBNAILS_DURATIONS)
            ->map(function ($percents) use ($video, $thumb_name, $duration) {
                $thumb_name .= '_' . ($percents * 100) . '.png';
                $video->getFrameFromSeconds($percents * $duration)
                    ->export()
                    ->toDisk('thumbnails')
                    ->save($thumb_name);

                return new Attachment([
                    'file_name' => $thumb_name,
                    'mime_type' => 'png',
                    'url' => url('thumbnails/' . $thumb_name),
                ]);
            });
    }
}
