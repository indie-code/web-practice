<?php


namespace Tests\Feature\AuthControllerTest;


use App\User;
use JWTAuth;
use Tests\TestCase;

class SignInTest extends TestCase
{
    /**
     * @var User
     */
    protected $user;

    protected function setUp()
    {
        parent::setUp();

        $this->user = factory(User::class)->create([
            'password' => '12345678',
        ]);
    }

    /**
     * Пользователь успешно авторизуется
     *
     * @test
     */
    public function success()
    {
        // Отправить запрос на авторизацию
        $response = $this->postJson(route('auth.sign-in'), [
            'email' => $this->user->email,
            'password' => '12345678',
        ]);

        // Проверка, что пришёл валидный токен
        $response->assertSuccessful();

        $payload = JWTAuth::getPayload($response->headers->get('Api-Token'));
        $this->assertEquals($this->user->id, $payload['sub']);
    }

    /**
     * При некорректной паре логин/пароль возвращается ошибка
     *
     * @test
     */
    public function not_allowed()
    {
        // Отправить запрос на авторизацию
        $response = $this->postJson(route('auth.sign-in'), [
            'email' => $this->user->email,
            'password' => '1234123',
        ]);

        // Проверка, что пришёл валидный токен
        $response->assertJsonValidationErrors(['email']);
    }
}
