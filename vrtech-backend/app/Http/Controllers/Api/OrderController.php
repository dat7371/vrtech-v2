<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Support\PhoneNumber;
use App\Support\TelegramNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => [
                'required',
                'string',
                'max:30',
                fn ($attribute, $value, $fail) => PhoneNumber::isValid($value) ? null : $fail(PhoneNumber::validationMessage()),
            ],
            'customer_email' => ['nullable', 'email', 'max:160'],
            'customer_address' => ['nullable', 'string', 'max:1000'],
            'consulting_note' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'items.*.product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.product_slug' => ['nullable', 'string', 'max:200'],
            'items.*.variant_sku' => ['nullable', 'string', 'max:120'],
            'items.*.product_name' => ['nullable', 'string', 'max:180'],
            'items.*.sku' => ['nullable', 'string', 'max:120'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
        ]);
        $data['customer_phone'] = PhoneNumber::normalize($data['customer_phone']);

        $order = DB::transaction(function () use ($data) {
            $customer = Customer::updateOrCreate(
                ['phone' => $data['customer_phone']],
                [
                    'name' => $data['customer_name'],
                    'email' => $data['customer_email'] ?? null,
                    'address' => $data['customer_address'] ?? null,
                ]
            );

            $order = Order::create([
                'customer_id' => $customer->id,
                'code' => 'VR' . now()->format('ymdHis') . Str::upper(Str::random(4)),
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_address' => $data['customer_address'] ?? null,
                'consulting_note' => $data['consulting_note'] ?? null,
                'status' => 'new',
                'source' => 'website',
            ]);

            $total = 0;
            foreach ($data['items'] as $index => $item) {
                [$product, $variant] = $this->resolveProductSelection($item, $index);
                $unitPrice = $variant
                    ? ($variant->sale_price ?? $variant->price)
                    : ($product->sale_price ?? $product->price);
                $lineTotal = $unitPrice * $item['quantity'];
                $total += $lineTotal;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name' => $item['product_name'] ?? $this->orderItemName($product, $variant),
                    'sku' => $variant?->sku ?? $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);
            }

            $order->update(['total_amount' => $total]);

            return $order;
        });
        $order->load('items');

        app(TelegramNotifier::class)->notifyOrder($order);

        return response()->json([
            'message' => 'Order received.',
            'data' => $order,
        ], 201);
    }

    private function resolveProductSelection(array $item, int $index): array
    {
        $variant = null;

        if ($item['product_variant_id'] ?? null) {
            $variant = ProductVariant::with('product')
                ->where('status', 'active')
                ->find($item['product_variant_id']);
        } elseif ($item['variant_sku'] ?? null) {
            $variant = ProductVariant::with('product')
                ->where('status', 'active')
                ->where('sku', $item['variant_sku'])
                ->first();
        }

        if ($variant && $variant->product && $variant->product->status === 'active') {
            return [$variant->product, $variant];
        }

        $product = null;
        if ($item['product_id'] ?? null) {
            $product = Product::with('activeVariants')
                ->where('status', 'active')
                ->find($item['product_id']);
        } elseif ($item['product_slug'] ?? null) {
            $product = Product::with('activeVariants')
                ->where('status', 'active')
                ->where('slug', $item['product_slug'])
                ->first();
        }

        if (! $product) {
            throw ValidationException::withMessages([
                "items.{$index}.product_slug" => 'Sản phẩm không hợp lệ hoặc đã ngừng bán.',
            ]);
        }

        return [$product, $product->activeVariants->first()];
    }

    private function orderItemName(Product $product, ?ProductVariant $variant): string
    {
        return trim($product->name . ($variant ? ' - ' . $variant->label : ''));
    }
}
