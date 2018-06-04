<?php

namespace App;

use Carbon\Carbon;
use DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Attachment
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $object_type
 * @property int|null $object_id
 * @property string $file_name
 * @property string $mime_type
 * @property string $url
 * @property int|null $size
 * @property int $uploaded_size
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection|Attachment[] $thumbnails
 * @method static Builder|Attachment whereCreatedAt($value)
 * @method static Builder|Attachment whereFileName($value)
 * @method static Builder|Attachment whereId($value)
 * @method static Builder|Attachment whereMimeType($value)
 * @method static Builder|Attachment whereObjectId($value)
 * @method static Builder|Attachment whereObjectType($value)
 * @method static Builder|Attachment whereUpdatedAt($value)
 * @method static Builder|Attachment whereUserId($value)
 * @method static Builder|Attachment whereUrl($value)
 * @method static Builder|Attachment whereSize($value)
 * @method static Builder|Attachment whereUploadedSize($value)
 * @mixin \Eloquent
 */
class Attachment extends Model
{
    protected $fillable = [
        'file_name',
        'mime_type',
        'url',
        'size',
        'uploaded_size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function thumbnails()
    {
        return $this->morphMany(Attachment::class, 'object');
    }

    public function video()
    {
        return $this->morphTo('video', 'object_type', 'object_id');
    }

    public function incrementUploadedSize(int $size)
    {
        DB::table($this->getTable())->where('id', $this->id)->increment('uploaded_size', $size);
        $this->refresh();
    }

    public function isUploaded()
    {
        return $this->size && $this->size === $this->uploaded_size;
    }
}
