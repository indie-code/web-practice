<?php

namespace App\Exceptions;

use Exception;

class JwtAuthFailedException extends Exception
{
    public function render($request)
    {
        return response([
            'message' => 'Пользователь не авторизован',
            'errors' => [$this->getMessage()],
            'type' => class_basename($this),
        ], 401);
    }
}
