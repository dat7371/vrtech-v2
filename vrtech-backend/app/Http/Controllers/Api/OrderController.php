<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:160'],
            'customer_address' => ['nullable', 'string', 'max:1000'],
            'consulting_note' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $order = Order::create([
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
        foreach ($data['items'] as $item) {
            $product = Product::find($item['product_id'] ?? null);
            $unitPrice = $product ? ($product->sale_price ?? $product->price) : 0;
            $lineTotal = $unitPrice * $item['quantity'];
            $total += $lineTotal;

            $order->items()->create([
                'product_id' => $product?->id,
                'product_name' => $product?->name ?? 'San pham tu van',
                'sku' => $product?->sku,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'line_total' => $lineTotal,
            ]);
        }

        $order->update(['total_amount' => $total]);

        return response()->json([
            'message' => 'Order received.',
            'data' => $order->load('items'),
        ], 201);
    }
}
