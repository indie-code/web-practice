<?php


namespace App\Exceptions;


use Illuminate\Http\Response;

class VideoNotFoundException extends \Exception
{
    public function render($request)
    {
        return response([
            'message' => 'Файл не найден',
            'errors' => [$this->getMessage()],
            'type' => class_basename($this),
        ], Response::HTTP_NOT_FOUND);
    }
}
