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

        $this->doesntExpectJobs(VideoThumbnailsJob::class);
        $response = $this
            ->loginAs()
            ->postJson(route('video-files.store'), ['size' => $this->file->getSize()])
            ->assertSuccessful();

        $this->assertNotNull($response->json('data.id'));
        /** @var Attachment $attachment */
        $attachment = Attachment::findOrFail($response->json('data.id'));
        Storage::disk('videos')->assertExists($attachment->file_name);
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
