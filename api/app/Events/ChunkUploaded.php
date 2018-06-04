<?php

namespace App\Events;

use App\Attachment;
use App\Http\Resources\AttachmentResource;
use Auth;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class ChunkUploaded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct(Attachment $attachment)
    {
        $attachment->loadMissing('video');
        $this->data = new AttachmentResource($attachment);
    }

    public function broadcastOn()
    {
        return new PrivateChannel('uploading-files.' . Auth::id());
    }
}
