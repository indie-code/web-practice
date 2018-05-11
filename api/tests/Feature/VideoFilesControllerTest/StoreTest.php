<?php


namespace Tests\Feature\VideoFilesControllerTest;


use App\Attachment;
use App\Components\FFMpegService;
use App\Events\ThumbnailsCreated;
use App\Jobs\VideoThumbnailsJob;
use App\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class StoreTest extends TestCase
{
    /**
     * @var UploadedFile
     */
    private $file;

    public function setUp()
    {
        parent::setUp();
        $this->file = UploadedFile::fake()->create('video.mp4');
    }

    /**
     * @test
     */
    public function attachments_store()
    {
        Storage::fake('videos');
        $this->expectsJobs(VideoThumbnailsJob::class);
        $response = $this
            ->loginAs()
            ->postJson(route('video-files.store'), ['file' => $this->file])
            ->assertSuccessful();

        $this->assertNotNull($response->json('data.id'));
        $this->assertEquals(route('video-files.show', $this->file->hashName()), $response->json('data.url'));

        Storage::disk('videos')->assertExists($this->file->hashName());
    }

    /**
     * @test
     */
    public function not_allowed_store()
    {
        $user = factory(User::class)->create(['verified' => false]);

        $this
            ->loginAs($user)
            ->postJson(route('video-files.store'), ['file' => $this->file])
            ->assertForbidden();
    }
}
