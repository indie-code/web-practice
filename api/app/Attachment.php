<?php

namespace App;

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
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereFileName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereObjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereObjectType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Attachment whereUserId($value)
 * @mixin \Eloquent
 * @property-read \App\User $user
 */
class Attachment extends Model
{
    protected $fillable = [
        'file_name',
        'mime_type',
        'url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function thumbnails()
    {
        return $this->morphMany(Attachment::class, 'object');
    }
}
