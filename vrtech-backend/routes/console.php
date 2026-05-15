<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;
use App\Support\TelegramNotifier;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('telegram:chat-id', function () {
    $token = config('services.telegram.bot_token');

    if (! filled($token)) {
        $this->error('Chua co TELEGRAM_BOT_TOKEN trong file .env.');
        $this->line('Hay dien token moi vao .env, nhan /start voi bot, roi chay lai lenh nay.');

        return self::FAILURE;
    }

    if (preg_match('/^\d+:[A-Za-z0-9_-]+$/', $token) !== 1) {
        $this->error('TELEGRAM_BOT_TOKEN khong dung dinh dang.');
        $this->line('Token dung se co dang: 123456789:AA...');
        $this->line('Khong them chu "bot", khong them khoang trang, khong them ky tu nao o dau/cuoi.');

        return self::FAILURE;
    }

    $options = [];
    $caBundle = config('services.telegram.ca_bundle');
    if (filter_var(config('services.telegram.verify_ssl'), FILTER_VALIDATE_BOOL) === false) {
        $options['verify'] = false;
    } elseif (is_string($caBundle) && $caBundle !== '' && is_file($caBundle)) {
        $options['verify'] = $caBundle;
    }

    $response = Http::timeout(8)->withOptions($options)->get('https://api.telegram.org/bot' . $token . '/getUpdates');

    if (! $response->successful()) {
        $this->error('Khong doc duoc getUpdates tu Telegram.');
        $this->line('Hay kiem tra token moi co dung khong.');

        return self::FAILURE;
    }

    $updates = $response->json('result', []);
    $chatIds = collect($updates)
        ->map(fn ($update) => data_get($update, 'message.chat.id') ?? data_get($update, 'my_chat_member.chat.id'))
        ->filter()
        ->unique()
        ->values();

    if ($chatIds->isEmpty()) {
        $this->warn('Chua thay chat_id nao.');
        $this->line('Hay mo bot cua ban, gui /start hoac test, roi chay lai lenh nay.');

        return self::SUCCESS;
    }

    $this->info('Chat ID tim thay:');
    $chatIds->each(fn ($chatId) => $this->line((string) $chatId));

    return self::SUCCESS;
})->purpose('Lay Telegram chat_id tu bot updates ma khong in token.');

Artisan::command('telegram:test {message?}', function (?string $message = null) {
    if (app(TelegramNotifier::class)->sendTest($message)) {
        $this->info('Da gui tin test Telegram.');

        return self::SUCCESS;
    }

    $this->error('Chua gui duoc Telegram. Hay kiem tra TELEGRAM_ENABLED, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.');

    return self::FAILURE;
})->purpose('Gui thu mot tin Telegram theo cau hinh .env.');
