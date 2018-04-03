<?php


namespace Tests\Feature\VideoFilesControllerTest;


use App\Exceptions\VideoNotFoundException;
use App\User;
use Illuminate\Http\UploadedFile;
use JWTAuth;
use Tests\TestCase;
use Illuminate\Support\Facades\Storage;

class ShowTest extends TestCase
{
    /**
     * @var UploadedFile
     */
    protected $file;

    /**
     * @var string
     */
    protected $token;

    /**
     * @var User
     */
    private $user;

    public function setUp()
    {
        parent::setUp();

        $this->file = UploadedFile::fake()->create('video.mp4');
        $this->user = factory(User::class)->create(['verified' => false]);
        $this->token = JWTAuth::fromUser($this->user);
    }

    /**
     * Файл доступен
     *
     * @test
     */
    public function show()
    {
        Storage::fake('videos');
        Storage::disk('videos')->put($this->file->hashName(), $this->file);

        $response = $this
            ->get(route('videos.show', [
                'video' => $this->file->hashName(),
                'api-token' => $this->token,
            ]));

        $response->assertHeader('X-Accel-Redirect', "/videos/{$this->file->hashName()}");
    }

    /**
     * При отсутствии видео возвращается ошибка в корректном формате
     *
     * @test
     */
    public function not_found_response()
    {
        $response = $this->get(route('videos.show', [
            'video' => 'fake.mp4',
            'api-token' => $this->token,
        ]));

        $this->assertEquals(class_basename(VideoNotFoundException::class), $response->json('type'));
    }
}
