<?php


namespace Tests\Unit;


use App\User;
use Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    /**
     * Мутатор для пароля отрабатывает
     *
     * @test
     */
    public function set_password_attribute()
    {
        /** @var User $user */
        $user = factory(User::class)->create();

        $user->password = '12345678';

        $this->assertTrue(Hash::check('12345678', $user->password));
    }
}
