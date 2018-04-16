<?php

namespace Tests\Feature\AuthControllerTest;

use App\User;
use JWTAuth;
use Tests\TestCase;
use URL;

class VerifyTest extends TestCase
{
    /**
     * @var User
     */
    protected $user;

    protected function setUp()
    {
        parent::setUp();
        $this->user = factory(User::class)->create(['verified' => false]);
    }

    /**
     * При корректном подтверждении выдаётся JWT токен
     *
     * @test
     */
    public function success()
    {
        $url = URL::temporarySignedRoute(
            'auth.verify',
            now()->addHour(),
            ['user' => $this->user->id]
        );

        $response = $this->getJson($url);

        $this->assertTrue($this->user->fresh()->verified);
        $response->assertHeader('Api-Token');
        $this->assertEquals($this->user->id, JWTAuth::getPayload($response->headers->get('Api-Token'))->get('sub'));
    }
    /**
     * При некорректном токене возвращается ошибка в корректном формате
     *
     * @test
     */
    public function verify_error_format()
    {
        $response = $this->getJson(route('auth.verify', [
            'user' => $this->user,
            'signature' => 'bad token'
        ]));

        $response->assertStatus(401);
        $this->assertEquals('InvalidSignatureException', $response->json('type'));
    }
}
