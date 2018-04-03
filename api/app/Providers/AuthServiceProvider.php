<?php

namespace App\Providers;

use App\Attachment;
use App\Policies\AttachmentsPolicy;
use App\Policies\VideosPolicy;
use App\Video;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Attachment::class => AttachmentsPolicy::class,
        Video::class => VideosPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
