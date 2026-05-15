@extends('admin.layouts.app')

@section('title', 'Tổng quan vận hành')

@section('content')
    <div class="page-head">
        <div>
            <h1>Tổng quan vận hành</h1>
            <p class="page-desc">Theo dõi sản phẩm Carlinkit/Vietmap, lead tư vấn và bảo hành điện tử.</p>
        </div>
        <div class="actions">
            <a class="btn" href="{{ route('admin.products.create') }}">Thêm sản phẩm</a>
            <a class="btn gold" href="{{ route('admin.warranties.create') }}">Kích hoạt bảo hành</a>
        </div>
    </div>

    <div class="grid">
        <a class="card metric" href="{{ route('admin.products.index') }}">
            <strong>{{ $activeProductCount }}/{{ $productCount }}</strong>
            <span>Sản phẩm đang bán</span>
            <small>Dữ liệu cho API frontend</small>
        </a>
        <a class="card metric" href="{{ route('admin.contacts.index') }}">
            <strong>{{ $newContactCount }}</strong>
            <span>Lead mới cần gọi</span>
            <small>Từ form tư vấn website</small>
        </a>
        <a class="card metric" href="{{ route('admin.warranties.index') }}">
            <strong>{{ $warrantyCount }}</strong>
            <span>Bảo hành đã kích hoạt</span>
            <small>Tra cứu theo SĐT / serial</small>
        </a>
        <a class="card metric" href="{{ route('admin.orders.index') }}">
            <strong>{{ $newOrderCount }}/{{ $orderCount }}</strong>
            <span>Đơn đặt hàng</span>
            <small>Đơn mới / tổng đơn</small>
        </a>
    </div>

    <div class="card">
        <div class="page-head">
            <div>
                <h2>Đơn hàng mới nhất</h2>
                <p class="page-desc">Theo dõi đơn từ website và cập nhật trạng thái xử lý.</p>
            </div>
            <a class="btn ghost" href="{{ route('admin.orders.index') }}">Quản lý đơn hàng</a>
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Mã đơn</th><th>Khách</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày tạo</th></tr></thead>
                <tbody>
                    @forelse ($latestOrders as $order)
                        <tr>
                            <td><a href="{{ route('admin.orders.show', $order) }}"><strong>{{ $order->code }}</strong></a></td>
                            <td>{{ $order->customer_name }}<br><span class="text-muted">{{ $order->customer_phone }}</span></td>
                            <td>{{ $order->items_count }} dòng</td>
                            <td>{{ number_format((float) $order->total_amount, 0, ',', '.') }}đ</td>
                            <td><span class="badge {{ $order->status }}">{{ $order->status }}</span></td>
                            <td>{{ $order->created_at?->format('d/m/Y H:i') }}</td>
                        </tr>
                    @empty
                        <tr><td class="empty" colspan="6">Chưa có đơn hàng từ website.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="page-head">
            <div>
                <h2>Lead tư vấn mới nhất</h2>
                <p class="page-desc">Ưu tiên gọi các lead trạng thái mới.</p>
            </div>
            <a class="btn ghost" href="{{ route('admin.contacts.index') }}">Xem tất cả</a>
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Khách</th><th>Xe</th><th>Sản phẩm quan tâm</th><th>Trạng thái</th><th>Ngày tạo</th></tr></thead>
                <tbody>
                    @forelse ($latestContacts as $contact)
                        <tr>
                            <td><strong>{{ $contact->name }}</strong><br><span class="text-muted">{{ $contact->phone }}</span></td>
                            <td>{{ $contact->car_model ?: '-' }}</td>
                            <td>{{ $contact->product_interest ?: 'Cần tư vấn' }}</td>
                            <td><span class="badge {{ $contact->status }}">{{ $contact->status }}</span></td>
                            <td>{{ $contact->created_at?->format('d/m/Y H:i') }}</td>
                        </tr>
                    @empty
                        <tr><td class="empty" colspan="5">Chưa có lead từ website.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="page-head">
            <div>
                <h2>Bảo hành mới kích hoạt</h2>
                <p class="page-desc">Dữ liệu phục vụ tra cứu bảo hành điện tử.</p>
            </div>
            <a class="btn ghost" href="{{ route('admin.warranties.index') }}">Quản lý bảo hành</a>
        </div>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Serial</th><th>Khách</th><th>Sản phẩm</th><th>Hết hạn</th><th>Trạng thái</th></tr></thead>
                <tbody>
                    @forelse ($latestWarranties as $warranty)
                        <tr>
                            <td><strong>{{ $warranty->serial_number }}</strong></td>
                            <td>{{ $warranty->customer?->name }}<br><span class="text-muted">{{ $warranty->customer?->phone }}</span></td>
                            <td>{{ $warranty->product?->name }}</td>
                            <td>{{ $warranty->expired_at?->format('d/m/Y') }}</td>
                            <td><span class="badge {{ $warranty->status }}">{{ $warranty->status }}</span></td>
                        </tr>
                    @empty
                        <tr><td class="empty" colspan="5">Chưa có bảo hành được kích hoạt.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
