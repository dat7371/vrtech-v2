@extends('admin.layouts.app')

@section('title', $product->exists ? 'Sửa sản phẩm' : 'Thêm sản phẩm')

@section('content')
    <div class="page-head">
        <div>
            <h1>{{ $product->exists ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
            <p class="page-desc">Thông tin này dùng cho admin, API sản phẩm và tư vấn khách hàng.</p>
        </div>
        <a class="btn ghost" href="{{ route('admin.products.index') }}">Quay lại</a>
    </div>

    <form method="post" action="{{ $product->exists ? route('admin.products.update', $product) : route('admin.products.store') }}">
        @csrf
        @if ($product->exists) @method('put') @endif

        <div class="card">
            <h2>Thông tin bán hàng</h2>
            <div class="form-grid">
                <label>Danh mục
                    <select name="category_id">
                        <option value="">Không chọn</option>
                        @foreach ($categories as $category)
                            <option value="{{ $category->id }}" @selected((int) old('category_id', $product->category_id) === $category->id)>{{ $category->name }}</option>
                        @endforeach
                    </select>
                </label>
                <label>Trạng thái
                    <select name="status">
                        <option value="active" @selected(old('status', $product->status) === 'active')>Đang bán</option>
                        <option value="inactive" @selected(old('status', $product->status) === 'inactive')>Ẩn khỏi API</option>
                    </select>
                </label>
            </div>

            <label>Tên sản phẩm
                <input name="name" value="{{ old('name', $product->name) }}" required>
            </label>
            @error('name') <p class="error">{{ $message }}</p> @enderror

            <div class="form-grid">
                <label>Slug URL/API
                    <input name="slug" value="{{ old('slug', $product->slug) }}" placeholder="tbox-s2p-v2">
                </label>
                <label>SKU / mã hàng
                    <input name="sku" value="{{ old('sku', $product->sku) }}" placeholder="TBOX-S2P-V2">
                </label>
            </div>
            @error('slug') <p class="error">{{ $message }}</p> @enderror
            @error('sku') <p class="error">{{ $message }}</p> @enderror

            <div class="form-grid three">
                <label>Giá niêm yết
                    <input name="price" type="number" min="0" step="1000" value="{{ old('price', $product->price ?? 0) }}">
                </label>
                <label>Giá khuyến mãi
                    <input name="sale_price" type="number" min="0" step="1000" value="{{ old('sale_price', $product->sale_price) }}">
                </label>
                <label>Bảo hành
                    <input name="warranty_months" type="number" min="0" value="{{ old('warranty_months', $product->warranty_months ?? 12) }}">
                </label>
            </div>
        </div>

        <div class="card">
            <h2>Cấu hình và nội dung</h2>
            <div class="form-grid">
                <label>CPU
                    <input name="cpu" value="{{ old('cpu', $product->cpu) }}">
                </label>
                <label>RAM
                    <input name="ram" value="{{ old('ram', $product->ram) }}">
                </label>
                <label>ROM
                    <input name="rom" value="{{ old('rom', $product->rom) }}">
                </label>
                <label>Hệ điều hành
                    <input name="os" value="{{ old('os', $product->os) }}">
                </label>
            </div>

            <label>Ảnh chính URL/path
                <input name="main_image" value="{{ old('main_image', $product->main_image) }}" placeholder="images/products12thv2/s2pv2/TBOX S2P 01.webp">
            </label>

            <label>Mô tả ngắn
                <textarea name="short_description">{{ old('short_description', $product->short_description) }}</textarea>
            </label>

            <label>Mô tả chi tiết
                <textarea name="description">{{ old('description', $product->description) }}</textarea>
            </label>
        </div>

        <div class="actions">
            <button class="btn" type="submit">Lưu sản phẩm</button>
            <a class="btn ghost" href="{{ route('admin.products.index') }}">Hủy</a>
        </div>
    </form>
@endsection
