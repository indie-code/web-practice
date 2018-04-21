<?php

namespace App\Policies;

use App\User;
use App\Video;
use Illuminate\Auth\Access\HandlesAuthorization;

class VideosPolicy
{
    use HandlesAuthorization;

    public function store(User $user)
    {
        return $user->verified;
    }

    public function show(User $user, Video $video)
    {
        // @TODO Реализовать логику для бесплатного и оплаченного контента
        return $user->id === $video->user_id;
    }
}
