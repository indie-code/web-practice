<?php

namespace Tests\Feature\VideoFilesControllerTest;


use App\Attachment;
use App\Video;
use Tests\TestCase;

class VideoFilesUploadingTest extends TestCase
{
    /**
     * @test
     */
    public function return_collection_of_uploading_files()
    {
        $this->allows(Attachment::class, 'upload');

        $this->loginAs();
        $uploading = factory(Attachment::class)->create([
            'size' => 123,
            'uploaded_size' => 10,
            'user_id' => $this->auth->id,
            'updated_at' => now(),
        ]);

        $video = factory(Video::class)->create();
        $uploading->video()->associate($video)->save();
        // uploaded
        factory(Attachment::class)->create([
            'size' => 123,
            'uploaded_size' => 123,
            'user_id' => $this->auth->id,
            'updated_at' => now(),
        ]);
        // overdue
        factory(Attachment::class)->create([
            'size' => 123,
            'uploaded_size' => 10,
            'updated_at' => now()->subMinutes(2),
            'user_id' => $this->auth->id,
        ]);

        // another_user_file
        factory(Attachment::class)->create([
            'size' => 123,
            'uploaded_size' => 10,
            'updated_at' => now(),
        ]);

        $response = $this->getJson(route('video-files.uploading'))->assertSuccessful();

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($uploading->id, $response->json('data.0.id'));
        $this->assertEquals($video->id, $response->json('data.0.video.id'));
    }

    /**
     * @test
     */
    public function cant_see_uploading_files_if_not_authorized()
    {
        $this->denies( Attachment::class, 'upload');
        $this->loginAs()->getJson(route('video-files.uploading'))->assertForbidden();
    }
}
