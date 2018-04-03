<?php

namespace App\Http\Middleware;

use App\Exceptions\JwtAuthFailedException;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\JWTAuth;

class JwtTokenMiddleware
{
    protected $events;

    protected $auth;

    public function __construct(Dispatcher $events, JWTAuth $auth)
    {
        $this->events = $events;
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     * @throws JwtAuthFailedException
     */
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        if (! $token) {
            $token = $request->input('api-token');
        }

        if (! $token) {
            throw new JwtAuthFailedException('tymon.jwt.absent');
        }

        try {
            $user = $this->auth->authenticate($token);
        } catch (TokenExpiredException $e) {
            throw new JwtAuthFailedException('tymon.jwt.expired');
        } catch (JWTException $e) {
            throw new JwtAuthFailedException('tymon.jwt.invalid');
        }

        if (! $user) {
            throw new JwtAuthFailedException('tymon.jwt.user_not_found');
        }

        $this->events->dispatch('tymon.jwt.valid', $user);

        return $next($request);
    }
}
