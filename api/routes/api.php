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
    Route::resource('attachments', 'AttachmentsController')
        ->only(['store'])
        ->names('attachments');
});
