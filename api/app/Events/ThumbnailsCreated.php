<?php

namespace App\Events;

use App\Http\Resources\AttachmentResource;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Support\Collection;

class ThumbnailsCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    private $attachmentId;

    public $data;

    public function __construct(int $attachmentId, Collection $thumbnails)
    {
        $this->attachmentId = $attachmentId;
        $this->data = AttachmentResource::collection($thumbnails)->jsonSerialize();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('video-file.' . $this->attachmentId);
    }
}
