@extends('admin.layouts.app')

@section('title', 'Khách hàng')

@section('content')
    <div class="page-head">
        <div>
            <h1>Khách hàng</h1>
            <p class="page-desc">Danh sách khách được tạo từ đơn hàng và bảo hành điện tử.</p>
        </div>
    </div>

    <div class="card">
        <form class="filters" method="get" action="{{ route('admin.customers.index') }}">
            <label>Tìm kiếm
                <input name="q" value="{{ $keyword }}" placeholder="Tên, số điện thoại, email, dòng xe">
            </label>
            <div></div>
            <div class="actions">
                <button class="btn" type="submit">Lọc</button>
                <a class="btn ghost" href="{{ route('admin.customers.index') }}">Xóa lọc</a>
            </div>
        </form>

        <div class="table-wrap">
            <table>
                <thead><tr><th>Khách hàng</th><th>Dòng xe</th><th>Email</th><th>Đơn hàng</th><th>Bảo hành</th><th>Ngày tạo</th><th></th></tr></thead>
                <tbody>
                @forelse ($customers as $customer)
                    <tr>
                        <td><strong>{{ $customer->name }}</strong><br><span class="text-muted">{{ $customer->phone }}</span></td>
                        <td>{{ $customer->car_model ?: '-' }}</td>
                        <td>{{ $customer->email ?: '-' }}</td>
                        <td>{{ $customer->orders_count }}</td>
                        <td>{{ $customer->warranties_count }}</td>
                        <td>{{ $customer->created_at?->format('d/m/Y H:i') }}</td>
                        <td class="actions"><a class="btn secondary small" href="{{ route('admin.customers.show', $customer) }}">Chi tiết</a></td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="7">Chưa có khách hàng.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $customers->links() }}</div>
    </div>
@endsection
