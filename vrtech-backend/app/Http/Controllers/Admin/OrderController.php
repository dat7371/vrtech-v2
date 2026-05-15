<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $keyword = trim((string) $request->query('q', ''));

        $orders = Order::query()
            ->withCount('items')
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($keyword !== '', function ($query) use ($keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('code', 'like', "%{$keyword}%")
                        ->orWhere('customer_name', 'like', "%{$keyword}%")
                        ->orWhere('customer_phone', 'like', "%{$keyword}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.orders.index', [
            'orders' => $orders,
            'status' => $status,
            'keyword' => $keyword,
            'statuses' => $this->statuses(),
        ]);
    }

    public function show(Order $order)
    {
        return view('admin.orders.show', [
            'order' => $order->load(['items.product', 'items.variant', 'customer']),
            'statuses' => $this->statuses(),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,confirmed,processing,completed,cancelled'],
            'consulting_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $order->update($data);

        return redirect()->route('admin.orders.show', $order)->with('status', 'Đã cập nhật đơn hàng.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('admin.orders.index')->with('status', 'Đã xóa đơn hàng.');
    }

    private function statuses(): array
    {
        return [
            'new' => 'Mới',
            'confirmed' => 'Đã xác nhận',
            'processing' => 'Đang xử lý',
            'completed' => 'Hoàn tất',
            'cancelled' => 'Đã hủy',
        ];
    }
}
