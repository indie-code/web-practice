<?php

Route::group(['prefix' => 'auth'], function () {
    Route::post('sign-up', 'AuthController@signUp')->name('auth.sign-up');
    Route::post('sign-in', 'AuthController@signIn')->name('auth.sign-in');
    Route::get('user', 'AuthController@user')->name('auth.user')->middleware('jwt.auth');
    Route::get('verify-email/{user}', 'AuthController@verify')
        ->middleware('signed')
        ->name('auth.verify');
});

Route::group(['middleware' => 'jwt.auth'], function () {
    Route::resource('video-files', 'VideoFilesController')
        ->only(['store', 'show'])
        ->names('video-files')
        ->parameters(['video_file' => '.*']);

    Route::resource('profile/videos', 'UserVideosController')
        ->only(['store', 'update', 'index'])
        ->names('profile.videos');

    Route::resource('videos', 'VideosController')
        ->only(['show'])
        ->names('videos');
});
