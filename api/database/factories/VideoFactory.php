<?php

use App\User;
use App\Video;
use Faker\Generator as Faker;

$factory->define(Video::class, function (Faker $faker) {
    return [
        'title' => $faker->title,
        'description' => $faker->paragraph,
        'user_id' => factory(User::class),
    ];
});
