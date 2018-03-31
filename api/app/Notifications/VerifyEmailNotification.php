<?php

namespace App\Notifications;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use function urlencode;

class VerifyEmailNotification extends Notification
{
    use Queueable;
    /**
     * @var User
     */
    public $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user)
    {
        //
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $verify_url = urlencode(URL::temporarySignedRoute('auth.verify', now()->addHour(), ['user' => $notifiable->id]));
        return (new MailMessage)
                    ->line('Вам необходимо подтвердить e-mail')
                    ->action('Подтвердить', config('app.front_url') . '?verify_url=' . $verify_url);
    }
}
