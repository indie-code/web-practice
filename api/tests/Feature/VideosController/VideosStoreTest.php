<?php


namespace Tests\Feature\VideosController;


use App\Attachment;
use App\User;
use App\Video;
use Tests\TestCase;

class VideosStoreTest extends TestCase
{
    private $validParams = [
        'title' => 'test title',
        'description' => 'test description',
    ];

    /**
     * Видео сохраняется
     *
     * @test
     */
    public function store()
    {
        $response = $this->loginAs()->postJson(route('profile.videos.store'), $this->validParams);

        $response->assertSuccessful();

        $id = $response->json('data.id');

        /** @var Video $video */
        $video = Video::find($id);
        $this->assertNotNull($video);
        $this->assertEquals($this->auth->id, $video->user_id);
        $this->assertEquals('test title', $video->title);
        $this->assertEquals('test description', $video->description);
    }

    /**
     * К видео добавляется файл
     *
     * @test
     */
    public function store_with_file()
    {
        /** @var Attachment $attachment */
        $attachment = factory(Attachment::class)->create();
        $preview = factory(Attachment::class)->create();

        $params = array_merge($this->validParams, [
            'attachment_id' => $attachment->id,
            'preview_id' => $preview->id,
        ]);
        $response = $this->loginAs($attachment->user)
            ->postJson(route('profile.videos.store'), $params);

        $response->assertSuccessful();

        $id = $response->json('data.id');

        /** @var Video $video */
        $video = Video::find($id);
        $this->assertNotNull($video->attachment);
        $this->assertEquals($attachment->id, $video->attachment->id);
        $this->assertNotNull($video->preview);
        $this->assertEquals($preview->id, $video->preview->id);
    }

    /**
     * Возвращаются корректные ошибки валидации
     *
     * @test
     */
    public function validation()
    {
        $this->loginAs()
            ->postJson(route('profile.videos.store'), [
                'title' => '',
                'attachment_id' => 999,
                'preview_id' => 999,
                ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'attachment_id', 'preview_id']);
    }

    /**
     * Пользователь, которому нельзя загружать видео, не проходить авторизацию
     *
     * @test
     */
    public function not_allowed()
    {
        $user = factory(User::class)->create(['verified' => false]);

        $this->loginAs($user)
            ->postJson(route('profile.videos.store'), $this->validParams)
            ->assertForbidden();
    }

    /**
     * Пользователь, которому нельзя загружать видео, не проходить авторизацию
     *
     * @test
     */
    public function not_allowed_when_attach_another_user_video()
    {
        $attachment = factory(Attachment::class)->create();
        $params = array_merge($this->validParams, ['attachment_id' => $attachment->id]);

        $this->loginAs()
            ->postJson(route('profile.videos.store'), $params)
            ->assertForbidden();
    }
}
