<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use JWTAuth;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, DatabaseTransactions;

    public function loginAs(User $user = null)
    {
        if (! $user) {
            $user = factory(User::class)->create(['verified' => true]);
        }

        $token = JWTAuth::fromUser($user);
        $this->defaultHeaders = ['Authorization' => "Bearer {$token}"];

        return $this;
    }
}
