<?php

use App\Attachment;
use App\User;
use Faker\Generator as Faker;

$factory->define(Attachment::class, function (Faker $faker) {
    return [
        'user_id' => factory(User::class)->lazy(['verified' => true]),
        'file_name' => $faker->word,
        'mime_type' => $faker->mimeType,
    ];
});
