<?php


namespace Tests\Feature\VideosController;


use App\User;
use App\Video;
use Illuminate\Support\Collection;
use Tests\TestCase;

class VideosIndexTest extends TestCase
{
    /**
     * Возвращается список видео
     *
     * @test
     */
    public function index()
    {
        /** @var User $user */
        $user = factory(User::class)->create();
        /** @var Video[]|Collection $videos */
        $videos = factory(Video::class, 3)->create(['user_id' => $user->id]);
        factory(Video::class)->create();

        $response = $this->loginAs($user)->getJson(route('profile.videos.index'));

        $this->assertEquals(
            $videos->pluck('id')->sort()->values()->toArray(),
            collect($response->json('data.*.id'))->sort()->values()->toArray()
        );
    }
}
