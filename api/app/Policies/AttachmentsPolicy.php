<?php

namespace App\Policies;

use App\Attachment;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AttachmentsPolicy
{
    use HandlesAuthorization;

    public function upload(User $user)
    {
        return $user->verified;
    }

    public function attach(User $user, Attachment $attachment)
    {
        return $attachment->user_id === $user->id;
    }
}
