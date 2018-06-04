<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use JWTAuth;
use Tests\Components\MocksGate;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, DatabaseTransactions, MocksGate;

    /**
     * @var User
     */
    protected $auth;

    public function loginAs(User $user = null)
    {
        if (! $user) {
            $user = factory(User::class)->create(['verified' => true]);
        }

        $this->auth = $user;

        $token = JWTAuth::fromUser($user);
        $this->defaultHeaders = ['Authorization' => "Bearer {$token}"];

        return $this;
    }
}
