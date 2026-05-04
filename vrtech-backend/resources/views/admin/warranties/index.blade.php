@extends('admin.layouts.app')

@section('title', 'Bảo hành điện tử')

@section('content')
    <div class="page-head">
        <div>
            <h1>Bảo hành điện tử</h1>
            <p class="page-desc">Quản lý serial, khách hàng, ngày kích hoạt và thời hạn bảo hành.</p>
        </div>
        <a class="btn" href="{{ route('admin.warranties.create') }}">Kích hoạt bảo hành</a>
    </div>

    <div class="card">
        <div class="table-wrap">
            <table>
                <thead><tr><th>Serial</th><th>Khách hàng</th><th>Sản phẩm</th><th>Ngày mua</th><th>Kích hoạt</th><th>Hết hạn</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>
                @forelse ($warranties as $warranty)
                    <tr>
                        <td><strong>{{ $warranty->serial_number }}</strong></td>
                        <td>{{ $warranty->customer?->name }}<br><span class="text-muted">{{ $warranty->customer?->phone }}</span></td>
                        <td>{{ $warranty->product?->name }}</td>
                        <td>{{ $warranty->purchase_date?->format('d/m/Y') ?: '-' }}</td>
                        <td>{{ $warranty->activated_at?->format('d/m/Y') ?: '-' }}</td>
                        <td>{{ $warranty->expired_at?->format('d/m/Y') ?: '-' }}</td>
                        <td><span class="badge {{ $warranty->status }}">{{ $warranty->status }}</span></td>
                        <td class="actions">
                            <a class="btn secondary" href="{{ route('admin.warranties.edit', $warranty) }}">Sửa</a>
                            <form class="inline-form" method="post" action="{{ route('admin.warranties.destroy', $warranty) }}" onsubmit="return confirm('Xóa bảo hành này?')">
                                @csrf
                                @method('delete')
                                <button class="btn danger" type="submit">Xóa</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="8">Chưa có bảo hành được kích hoạt.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $warranties->links() }}</div>
    </div>
@endsection
