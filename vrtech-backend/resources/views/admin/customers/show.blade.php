@extends('admin.layouts.app')

@section('title', 'Chi tiết khách hàng')

@section('content')
    <div class="page-head">
        <div>
            <h1>{{ $customer->name }}</h1>
            <p class="page-desc">Thông tin khách hàng, lịch sử đơn hàng và bảo hành.</p>
        </div>
        <a class="btn ghost" href="{{ route('admin.customers.index') }}">Quay lại</a>
    </div>

    <form method="post" action="{{ route('admin.customers.update', $customer) }}">
        @csrf
        @method('put')
        <div class="card">
            <h2>Thông tin khách hàng</h2>
            <div class="form-grid">
                <label>Tên khách
                    <input name="name" value="{{ old('name', $customer->name) }}" required>
                </label>
                <label>Số điện thoại
                    <input name="phone" value="{{ old('phone', $customer->phone) }}" required>
                </label>
                <label>Email
                    <input name="email" type="email" value="{{ old('email', $customer->email) }}">
                </label>
                <label>Dòng xe
                    <input name="car_model" value="{{ old('car_model', $customer->car_model) }}">
                </label>
            </div>
            <label>Địa chỉ
                <textarea name="address">{{ old('address', $customer->address) }}</textarea>
            </label>
            <label>Ghi chú nội bộ
                <textarea name="note">{{ old('note', $customer->note) }}</textarea>
            </label>
            <div class="actions">
                <button class="btn" type="submit">Lưu khách hàng</button>
            </div>
        </div>
    </form>

    <div class="card">
        <h2>Lịch sử đơn hàng</h2>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Mã đơn</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr></thead>
                <tbody>
                @forelse ($customer->orders as $order)
                    <tr>
                        <td><strong>{{ $order->code }}</strong></td>
                        <td>{{ number_format((float) $order->total_amount, 0, ',', '.') }}đ</td>
                        <td><span class="badge {{ $order->status }}">{{ $order->status }}</span></td>
                        <td>{{ $order->created_at?->format('d/m/Y H:i') }}</td>
                        <td><a class="btn secondary small" href="{{ route('admin.orders.show', $order) }}">Xem đơn</a></td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="5">Chưa có đơn hàng.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <h2>Bảo hành của khách</h2>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Serial</th><th>Sản phẩm</th><th>Kích hoạt</th><th>Hết hạn</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>
                @forelse ($customer->warranties as $warranty)
                    <tr>
                        <td><strong>{{ $warranty->serial_number }}</strong></td>
                        <td>{{ $warranty->product?->name ?: '-' }}</td>
                        <td>{{ $warranty->activated_at?->format('d/m/Y') ?: '-' }}</td>
                        <td>{{ $warranty->expired_at?->format('d/m/Y') ?: '-' }}</td>
                        <td><span class="badge {{ $warranty->status }}">{{ $warranty->status }}</span></td>
                        <td><a class="btn secondary small" href="{{ route('admin.warranties.edit', $warranty) }}">Sửa bảo hành</a></td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="6">Chưa có bảo hành.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
