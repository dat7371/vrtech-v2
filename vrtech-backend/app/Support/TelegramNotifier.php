<?php

namespace App\Support;

use App\Models\Contact;
use App\Models\Order;
use App\Models\Warranty;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramNotifier
{
    public function notifyContact(Contact $contact): void
    {
        $this->send([
            'Lead tu van moi',
            '',
            'Khach: ' . $this->value($contact->name),
            'SDT: ' . $this->value($contact->phone),
            'Dong xe: ' . $this->value($contact->car_model),
            'San pham quan tam: ' . $this->value($contact->product_interest),
            'Noi dung: ' . $this->value($contact->message),
            'Nguon: ' . $this->value($contact->source),
            'Thoi gian: ' . optional($contact->created_at)->format('d/m/Y H:i'),
        ]);
    }

    public function notifyOrder(Order $order): void
    {
        $order->loadMissing('items');

        $lines = [
            'Don hang moi ' . $order->code,
            '',
            'Khach: ' . $this->value($order->customer_name),
            'SDT: ' . $this->value($order->customer_phone),
            'Email: ' . $this->value($order->customer_email),
            'Dia chi: ' . $this->value($order->customer_address),
            'Tong tien: ' . $this->money($order->total_amount),
            'Ghi chu: ' . $this->value($order->consulting_note),
            '',
            'San pham:',
        ];

        foreach ($order->items as $item) {
            $lines[] = '- ' . $item->product_name . ' x' . $item->quantity . ' - ' . $this->money($item->line_total);
        }

        $lines[] = '';
        $lines[] = 'Thoi gian: ' . optional($order->created_at)->format('d/m/Y H:i');

        $this->send($lines);
    }

    public function notifyWarrantyCheck(array $lookup, ?Warranty $warranty = null): void
    {
        $lines = [
            'Tra cuu bao hanh',
            '',
            'SDT nhap: ' . $this->value($lookup['phone'] ?? null),
            'Serial nhap: ' . $this->value($lookup['serial_number'] ?? null),
            'Ma don nhap: ' . $this->value($lookup['order_code'] ?? null),
            'Ket qua: ' . ($warranty ? 'Tim thay' : 'Khong tim thay'),
        ];

        if ($warranty) {
            $warranty->loadMissing(['customer', 'product']);

            $lines[] = '';
            $lines[] = 'San pham: ' . $this->value($warranty->product?->name);
            $lines[] = 'Serial: ' . $this->value($warranty->serial_number);
            $lines[] = 'Trang thai: ' . $this->value($warranty->status);
            $lines[] = 'Khach: ' . $this->value($warranty->customer?->name);
            $lines[] = 'SDT khach: ' . $this->value($warranty->customer?->phone);
            $lines[] = 'Dong xe: ' . $this->value($warranty->customer?->car_model);
            $lines[] = 'Ngay kich hoat: ' . $this->date($warranty->activated_at);
            $lines[] = 'Ngay het han: ' . $this->date($warranty->expired_at);
        }

        $lines[] = '';
        $lines[] = 'Thoi gian: ' . now()->format('d/m/Y H:i');

        $this->send($lines);
    }

    public function sendTest(?string $message = null): bool
    {
        return $this->send([
            $message ?: 'VRTECH Telegram test: ket noi thanh cong.',
            'Thoi gian: ' . now()->format('d/m/Y H:i'),
        ]);
    }

    private function send(array $lines): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        try {
            $response = $this->client()->post($this->apiUrl('sendMessage'), [
                'chat_id' => config('services.telegram.chat_id'),
                'text' => implode("\n", $lines),
                'disable_web_page_preview' => true,
            ]);

            if (! $response->successful()) {
                Log::warning('Telegram notification failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return false;
            }

            return true;
        } catch (\Throwable $exception) {
            Log::warning('Telegram notification exception.', [
                'message' => $this->withoutToken($exception->getMessage()),
            ]);

            return false;
        }
    }

    private function isConfigured(): bool
    {
        return (bool) config('services.telegram.enabled')
            && $this->isValidToken(config('services.telegram.bot_token'))
            && filled(config('services.telegram.chat_id'));
    }

    private function client()
    {
        $options = [];
        $caBundle = config('services.telegram.ca_bundle');

        if (filter_var(config('services.telegram.verify_ssl'), FILTER_VALIDATE_BOOL) === false) {
            $options['verify'] = false;
        } elseif (is_string($caBundle) && $caBundle !== '' && is_file($caBundle)) {
            $options['verify'] = $caBundle;
        }

        return Http::timeout(8)->withOptions($options);
    }

    private function apiUrl(string $method): string
    {
        return 'https://api.telegram.org/bot' . config('services.telegram.bot_token') . '/' . $method;
    }

    private function isValidToken(?string $token): bool
    {
        return is_string($token) && preg_match('/^\d+:[A-Za-z0-9_-]+$/', $token) === 1;
    }

    private function withoutToken(string $message): string
    {
        $token = config('services.telegram.bot_token');

        return is_string($token) && $token !== ''
            ? str_replace($token, '[telegram-token-redacted]', $message)
            : $message;
    }

    private function value(?string $value): string
    {
        $value = trim((string) $value);

        return $value === '' ? '-' : $value;
    }

    private function date($value): string
    {
        return $value ? $value->format('d/m/Y') : '-';
    }

    private function money($value): string
    {
        return number_format((float) $value, 0, ',', '.') . 'd';
    }
}
