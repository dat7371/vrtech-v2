@extends('admin.layouts.app')

@section('title', 'Chi tiết đơn hàng')

@section('content')
    <div class="page-head">
        <div>
            <h1>Đơn {{ $order->code }}</h1>
            <p class="page-desc">Thông tin khách hàng, sản phẩm đặt mua và trạng thái xử lý.</p>
        </div>
        <a class="btn ghost" href="{{ route('admin.orders.index') }}">Quay lại</a>
    </div>

    <div class="card">
        <div class="summary-grid">
            <div class="summary-item">
                <span>Khách hàng</span>
                <strong>{{ $order->customer_name }}</strong>
                <p class="text-muted">{{ $order->customer_phone }}</p>
            </div>
            <div class="summary-item">
                <span>Email</span>
                <strong>{{ $order->customer_email ?: '-' }}</strong>
            </div>
            <div class="summary-item">
                <span>Tổng tiền</span>
                <strong>{{ number_format((float) $order->total_amount, 0, ',', '.') }}đ</strong>
            </div>
            <div class="summary-item">
                <span>Trạng thái</span>
                <strong><span class="badge {{ $order->status }}">{{ $statuses[$order->status] ?? $order->status }}</span></strong>
            </div>
        </div>
        @if ($order->customer_address)
            <p><strong>Địa chỉ:</strong> {{ $order->customer_address }}</p>
        @endif
    </div>

    <div class="card">
        <h2>Sản phẩm trong đơn</h2>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Sản phẩm</th><th>SKU</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
                <tbody>
                    @forelse ($order->items as $item)
                        <tr>
                            <td><strong>{{ $item->product_name }}</strong></td>
                            <td>{{ $item->sku ?: '-' }}</td>
                            <td>{{ $item->quantity }}</td>
                            <td>{{ number_format((float) $item->unit_price, 0, ',', '.') }}đ</td>
                            <td><strong>{{ number_format((float) $item->line_total, 0, ',', '.') }}đ</strong></td>
                        </tr>
                    @empty
                        <tr><td class="empty" colspan="5">Đơn hàng chưa có sản phẩm.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <form method="post" action="{{ route('admin.orders.update', $order) }}">
        @csrf
        @method('put')
        <div class="card">
            <h2>Xử lý đơn hàng</h2>
            <label>Trạng thái
                <select name="status">
                    @foreach ($statuses as $value => $label)
                        <option value="{{ $value }}" @selected(old('status', $order->status) === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </label>
            <label>Ghi chú tư vấn
                <textarea name="consulting_note" placeholder="Ví dụ: đã gọi lần 1, khách cần tư vấn theo dòng xe, hẹn gọi lại...">{{ old('consulting_note', $order->consulting_note) }}</textarea>
            </label>
            <div class="actions">
                <button class="btn" type="submit">Lưu xử lý</button>
            </div>
        </div>
    </form>

    <form method="post" action="{{ route('admin.orders.destroy', $order) }}" onsubmit="return confirm('Xóa đơn hàng này?')">
        @csrf
        @method('delete')
        <button class="btn danger" type="submit">Xóa đơn hàng</button>
    </form>
@endsection
