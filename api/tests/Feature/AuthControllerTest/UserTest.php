<?php


namespace Tests\Feature\AuthControllerTest;


use App\User;
use Carbon\Carbon;
use Config;
use JWTAuth;
use Tests\TestCase;

class UserTest extends TestCase
{
    /**
     * @var User
     */
    protected $user;

    /**
     * @var string
     */
    protected $token;

    protected function setUp()
    {
        parent::setUp();

        $this->user = factory(User::class)->create();
    }

    /**
     * Возвращается информация о пользователе
     *
     * @test
     */
    public function success()
    {
        $this->loginAs($this->user);

        $response = $this->getJson(route('auth.user'));

        $response->assertSuccessful();
        $this->assertEquals($this->user->id, $response->json('data.user.id'));
    }

    /**
     * Возвращается 401, если пользователь не авторизован
     *
     * @test
     */
    public function unauthorized_when_token_not_passed()
    {
        $response = $this->getJson(route('auth.user'));
        $this->assertEquals('tymon.jwt.absent', $response->json('errors.0'));
        $this->assertEquals('JwtAuthFailedException', $response->json('type'));
        $response->assertStatus(401);
    }

    /**
     * Возвращается 401, если пользователь передал невалидный токен
     *
     * @test
     */
    public function unauthorized_when_token_expired()
    {
        Config::set('jwt.ttl', 1);
        $wrongToken = JWTAuth::fromUser(factory(User::class)->create());

        Carbon::setTestNow('+1 day');
        $this->defaultHeaders = ['Authorization' => "Bearer {$wrongToken}"];
        $response = $this->getJson(route('auth.user'));

        $this->assertEquals('tymon.jwt.expired', $response->json('errors.0'));
        $this->assertEquals('JwtAuthFailedException', $response->json('type'));
        $response->assertStatus(401);
    }

    /**
     * Возвращается 401, если пользователь передал невалидный токен
     *
     * @test
     */
    public function unauthorized_when_token_invalid()
    {
        $this->defaultHeaders = ['Authorization' => "Bearer asdasdqwfenperugh08347gre8ouh.wfqrf435ghwe5h.wehbwretb"];
        $response = $this->getJson(route('auth.user'));

        $this->assertEquals('tymon.jwt.invalid', $response->json('errors.0'));
        $this->assertEquals('JwtAuthFailedException', $response->json('type'));
        $response->assertStatus(401);
    }

    /**
     * Возвращается 401, если пользователь передал невалидный токен
     *
     * @test
     */
    public function unauthorized_when_user_not_found()
    {
        $user = factory(User::class)->create();
        $token = JWTAuth::fromUser($user);
        $user->delete();

        $this->defaultHeaders = ['Authorization' => "Bearer {$token}"];
        $response = $this->getJson(route('auth.user'));

        $this->assertEquals('tymon.jwt.user_not_found', $response->json('errors.0'));
        $this->assertEquals('JwtAuthFailedException', $response->json('type'));
        $response->assertStatus(401);
    }
}
