<?php

namespace App\Components;

use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;

class UploadedFileService
{
    public function writeChunk(string $toFile, UploadedFile $uploaded, int $start = 0)
    {
        $out = fopen($toFile, 'r+');
        fseek($out, $start);

        $in = fopen($uploaded->getRealPath(), 'r');
        while ($line = fread($in, 1024)) {
            fwrite($out, $line);
        }

        fclose($in);
        fclose($out);

        return new File($toFile);
    }
}
