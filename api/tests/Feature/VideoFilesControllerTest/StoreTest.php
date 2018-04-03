<?php


namespace Tests\Feature\VideoFilesControllerTest;


use App\User;
use function factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

        $response = $this
            ->loginAs()
            ->postJson(route('videos.store'), ['file' => $this->file])
            ->assertSuccessful();

        $this->assertNotNull($response->json('data.id'));
        $this->assertEquals($this->file->hashName(), $response->json('data.file_name'));

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
             ->postJson(route('videos.store'), ['file' => $this->file])
             ->assertForbidden();
     }
}
