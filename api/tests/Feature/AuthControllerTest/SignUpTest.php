<?php


namespace Tests\Feature;


use App\Notifications\VerifyEmailNotification;
use App\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Notification;
use JWTAuth;
use Tests\TestCase;

class SignUpTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * Пользователь успешно регистрируется
     *
     * @test
     */
    public function success()
    {
        $response = $this->postJson(route('auth.sign-up', [
            'email' => 'test.test@test.ru',
            'password' => '12345',
            'password_confirmation' => '12345',
            'name' => 'Василий',
        ]));

        $response->assertSuccessful();

        $user = User::whereEmail('test.test@test.ru')->first();
        $this->assertNotNull($user);
        $this->assertEquals($user->id, $response->json('data.user.id'));
        $this->assertEquals($user->name, $response->json('data.user.name'));
        $response->assertHeader('api-token');
        $this->assertEquals($user->id, JWTAuth::getPayload($response->headers->get('api-token'))->get('sub'));
    }

    /**
     * Возвращаются корректные ошибки валидации
     *
     * @test
     * @dataProvider provider_validation
     * @param $params
     * @param $errors
     */
    public function validation($params, $errors)
    {
            $this
                ->postJson(route('auth.sign-up'), $params)
                ->assertJsonValidationErrors($errors)
        ;
        
    }
    
    public function provider_validation()
    {
        return [
            'Отсутствует email' => [['name' => 'Василий', 'password' => '12345678', 'password_confirmation' => '12345678'], ['email']],
            'Отсутствует name' => [['email' => 'test@test.ru', 'password' => '12345678', 'password_confirmation' => '12345678'], ['name']],
            'Отсутствует password' => [['email' => 'test@test.ru', 'name' => 'Василий', 'password_confirmation' => '12345678'], ['password']],
            'Пароли не совпадают' => [['email' => 'test@test.ru', 'name' => 'Василий', 'password_confirmation' => '123456789'], ['password']],
        ];
    }

    /**
     * @test
     */
    public function notification_sent_on_register()
    {
        Notification::fake();

        $this->postJson(route('auth.sign-up', [
            'email' => 'test.test@test.ru',
            'password' => '12345',
            'password_confirmation' => '12345',
            'name' => 'Василий',
        ]));

        $user = User::whereEmail('test.test@test.ru')->first();

        Notification::assertSentTo($user, VerifyEmailNotification::class, function ($notification) use ($user) {
            return $notification->user->id === $user->id;
        });
    }

    /**
     * @test
     */
    public function unique_email_validation()
    {
        factory(User::class)->create(['email' => '123456@123456.ru']);

        $response = $this->postJson(route('auth.sign-up', [
            'email' => '123456@123456.ru',
            'password' => '12345',
            'password_confirmation' => '12345',
            'name' => 'Василий',
        ]));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}
