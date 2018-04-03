<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VideosPolicy
{
    use HandlesAuthorization;

    public function store(User $user)
    {
        return $user->verified;
    }
}
