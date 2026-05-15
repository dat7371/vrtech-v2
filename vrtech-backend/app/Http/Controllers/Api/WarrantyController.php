<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Warranty;
use App\Support\PhoneNumber;
use App\Support\SerialNumber;
use App\Support\TelegramNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class WarrantyController extends Controller
{
    public function check(Request $request)
    {
        $data = $request->validate([
            'phone' => [
                'nullable',
                'string',
                'max:30',
                'required_without_all:serial_number,order_code',
                fn ($attribute, $value, $fail) => filled($value) && ! PhoneNumber::isValid($value)
                    ? $fail(PhoneNumber::validationMessage())
                    : null,
            ],
            'serial_number' => [
                'nullable',
                'string',
                'max:120',
                'required_without_all:phone,order_code',
                fn ($attribute, $value, $fail) => filled($value) && ! SerialNumber::isValid($value)
                    ? $fail(SerialNumber::validationMessage())
                    : null,
            ],
            'order_code' => ['nullable', 'string', 'max:120', 'required_without_all:phone,serial_number'],
        ]);
        if (isset($data['phone'])) {
            $data['phone'] = PhoneNumber::normalize($data['phone']);
        }
        if (isset($data['serial_number'])) {
            $data['serial_number'] = SerialNumber::normalize($data['serial_number']);
        }
        $order = isset($data['order_code'])
            ? Order::where('code', $data['order_code'])->first()
            : null;

        $warranty = Warranty::query()
            ->with(['customer', 'product'])
            ->when($data['serial_number'] ?? null, fn ($query, $serial) => $query->where('serial_number', $serial))
            ->when($data['phone'] ?? null, fn ($query, $phone) => $query->whereHas('customer', fn ($customer) => $customer->where('phone', $phone)))
            ->when($data['order_code'] ?? null, fn ($query) => $order
                ? $query->where('customer_id', $order->customer_id)
                : $query->whereRaw('1 = 0'))
            ->first();

        if (! $warranty) {
            app(TelegramNotifier::class)->notifyWarrantyCheck($data);

            return response()->json([
                'message' => 'Không tìm thấy thông tin bảo hành.',
                'data' => null,
            ], 404);
        }

        app(TelegramNotifier::class)->notifyWarrantyCheck($data, $warranty);

        $expiredAt = $warranty->expired_at;

        return response()->json([
            'message' => 'Đã tìm thấy thông tin bảo hành.',
            'data' => [
                'serial_number' => $warranty->serial_number,
                'status' => $warranty->status,
                'status_label' => $this->statusLabel($warranty->status, $expiredAt),
                'is_expired' => $expiredAt ? $expiredAt->isPast() : false,
                'remaining_days' => $expiredAt ? max(0, Carbon::today()->diffInDays($expiredAt, false)) : null,
                'purchase_date' => $warranty->purchase_date?->format('d/m/Y'),
                'activated_at' => $warranty->activated_at?->format('d/m/Y'),
                'expired_at' => $expiredAt?->format('d/m/Y'),
                'note' => $warranty->note,
                'customer' => [
                    'name' => $warranty->customer?->name,
                    'phone' => $warranty->customer?->phone,
                    'car_model' => $warranty->customer?->car_model,
                ],
                'product' => [
                    'name' => $warranty->product?->name,
                    'sku' => $warranty->product?->sku,
                    'warranty_months' => $warranty->product?->warranty_months,
                ],
            ],
        ]);
    }

    private function statusLabel(string $status, $expiredAt): string
    {
        if ($status === 'active' && $expiredAt && $expiredAt->isPast()) {
            return 'Đã hết hạn';
        }

        return match ($status) {
            'active' => 'Còn bảo hành',
            'expired' => 'Đã hết hạn',
            'cancelled' => 'Đã hủy',
            default => $status,
        };
    }
}
