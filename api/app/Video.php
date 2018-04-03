<?php


namespace App;


use Illuminate\Database\Eloquent\Model;

/**
 * App\Video
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \App\Attachment $attachment
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Video whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Video whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Video whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Video whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Video whereUpdatedAt($value)
 * @mixin \Eloquent
 * @property int $user_id
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Video whereUserId($value)
 */
class Video extends Model
{
    protected $fillable = ['title', 'description'];

    public function attachment()
    {
        return $this->morphOne(Attachment::class, 'object');
    }
}

