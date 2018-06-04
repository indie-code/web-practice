<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

use App\Attachment;
use App\User;

Broadcast::channel('video-file.{attachment}', function (User $user, Attachment $attachment) {
    return $attachment->user_id === $user->id;
});

Broadcast::channel('uploading-files.{user}', function (User $auth, User $user) {
    return $auth->id === $user->id;
});
