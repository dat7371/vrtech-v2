@extends('admin.layouts.app')

@section('title', 'Sản phẩm')

@section('content')
    <div class="page-head">
        <div>
            <h1>Sản phẩm</h1>
            <p class="page-desc">Danh sách sản phẩm đang dùng cho API frontend và form tư vấn.</p>
        </div>
        <a class="btn" href="{{ route('admin.products.create') }}">Thêm sản phẩm</a>
    </div>

    <div class="card">
        <div class="table-wrap">
            <table>
                <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Cấu hình</th><th>Giá</th><th>Bảo hành</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>
                @forelse ($products as $product)
                    <tr>
                        <td>
                            <div class="actions" style="flex-wrap:nowrap;">
                                @if ($product->main_image)
                                    <img class="thumb" src="{{ str_starts_with($product->main_image, 'http') ? $product->main_image : route('admin.assets.show', ['path' => $product->main_image]) }}" alt="">
                                @else
                                    <span class="thumb" style="display:grid;place-items:center;font-weight:900;color:#e50914;">VR</span>
                                @endif
                                <span>
                                    <strong>{{ $product->name }}</strong><br>
                                    <span class="text-muted">{{ $product->sku ?: $product->slug }}</span>
                                </span>
                            </div>
                        </td>
                        <td>{{ $product->category?->name ?: '-' }}</td>
                        <td>{{ collect([$product->cpu, $product->ram, $product->rom, $product->os])->filter()->join(' / ') ?: '-' }}</td>
                        <td>
                            <strong>{{ number_format((float) ($product->sale_price ?: $product->price), 0, ',', '.') }}đ</strong>
                            @if ($product->sale_price)
                                <br><span class="text-muted"><s>{{ number_format((float) $product->price, 0, ',', '.') }}đ</s></span>
                            @endif
                        </td>
                        <td>{{ $product->warranty_months }} tháng</td>
                        <td><span class="badge {{ $product->status }}">{{ $product->status }}</span></td>
                        <td class="actions">
                            <a class="btn secondary" href="{{ route('admin.products.edit', $product) }}">Sửa</a>
                            <form class="inline-form" method="post" action="{{ route('admin.products.destroy', $product) }}" onsubmit="return confirm('Xóa sản phẩm này?')">
                                @csrf
                                @method('delete')
                                <button class="btn danger" type="submit">Xóa</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="7">Chưa có sản phẩm. Hãy seed dữ liệu hoặc thêm sản phẩm đầu tiên.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $products->links() }}</div>
    </div>
@endsection
