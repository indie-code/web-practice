<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Notifications\VerifyEmailNotification;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use JWTAuth;

class AuthController extends Controller
{
    use AuthenticatesUsers;

    public function signUp(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
            'password' => 'required|confirmed',
        ]);

        $user = new User();
        $user->email = $request->input('email');
        $user->name = $request->input('name');
        $user->password = $request->input('password');

        $user->save();

        $user->notify(new VerifyEmailNotification());

        return $this->authenticated($request, $user);
    }

    public function signIn(Request $request)
    {
        $this->validateLogin($request);

        if ($this->attemptLogin($request)) {
            return $this->authenticated($request, auth()->user());
        }

        return $this->sendFailedLoginResponse($request);
    }

    public function user()
    {
        return new AuthResource(auth()->user());
    }

    public function verify(Request $request, User $user)
    {
        $user->verified = true;
        $user->save();

        return $this->authenticated($request, $user);
    }

    protected function authenticated(Request $request, $user)
    {
        return (new AuthResource($user))
            ->response()
            ->header('Api-Token', JWTAuth::fromUser($user));
    }
}
