@extends('admin.layouts.app')

@section('title', 'Đơn hàng')

@section('content')
    <div class="page-head">
        <div>
            <h1>Đơn hàng</h1>
            <p class="page-desc">Đơn đặt hàng gửi từ website. Cập nhật trạng thái và ghi chú tư vấn tại đây.</p>
        </div>
    </div>

    <div class="card">
        <form class="filters" method="get" action="{{ route('admin.orders.index') }}">
            <label>Tìm kiếm
                <input name="q" value="{{ $keyword }}" placeholder="Mã đơn, tên khách, số điện thoại">
            </label>
            <label>Trạng thái
                <select name="status">
                    <option value="">Tất cả trạng thái</option>
                    @foreach ($statuses as $value => $label)
                        <option value="{{ $value }}" @selected($status === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </label>
            <div class="actions">
                <button class="btn" type="submit">Lọc</button>
                <a class="btn ghost" href="{{ route('admin.orders.index') }}">Xóa lọc</a>
            </div>
        </form>

        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Nguồn</th>
                        <th>Ngày tạo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                @forelse ($orders as $order)
                    <tr>
                        <td><strong>{{ $order->code }}</strong></td>
                        <td>
                            <strong>{{ $order->customer_name }}</strong><br>
                            <span class="text-muted">{{ $order->customer_phone }}</span>
                        </td>
                        <td>{{ $order->items_count }} dòng</td>
                        <td><strong>{{ number_format((float) $order->total_amount, 0, ',', '.') }}đ</strong></td>
                        <td><span class="badge {{ $order->status }}">{{ $statuses[$order->status] ?? $order->status }}</span></td>
                        <td><span class="badge">{{ $order->source }}</span></td>
                        <td>{{ $order->created_at?->format('d/m/Y H:i') }}</td>
                        <td class="actions">
                            <a class="btn secondary small" href="{{ route('admin.orders.show', $order) }}">Chi tiết</a>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="8">Chưa có đơn hàng từ website.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $orders->links() }}</div>
    </div>
@endsection
