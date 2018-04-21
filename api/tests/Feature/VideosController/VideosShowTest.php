<?php


namespace Tests\Feature\VideosController;


use App\User;
use App\Video;
use Tests\TestCase;

class VideosShowTest extends TestCase
{
    /**
     * @test
     */
    public function not_allowed()
    {
        $video = factory(Video::class)->create();
        $this->loginAs()->getJson(route('videos.show', $video))->assertForbidden();
    }

    /**
     * @test
     */
    public function allowed()
    {
        $author = factory(User::class)->create();
        $video = factory(Video::class)->create(['user_id' => $author->id]);
        $response = $this->loginAs($author)
            ->getJson(route('videos.show', $video))
            ->assertSuccessful();

        $this->assertEquals($video->id, $response->json('data.id'));
    }
}
