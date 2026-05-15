@extends('admin.layouts.app')

@section('title', $product->exists ? 'Sửa sản phẩm' : 'Thêm sản phẩm')

@section('content')
    @php
        $variantRows = collect(old('variants', $product->variants?->toArray() ?: []));
        $emptyRows = max(0, 4 - $variantRows->count());
        for ($i = 0; $i < $emptyRows; $i++) {
            $variantRows->push([]);
        }
    @endphp

    <div class="page-head">
        <div>
            <h1>{{ $product->exists ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h1>
            <p class="page-desc">Thông tin này lưu trong database backend/API. Frontend tĩnh chỉ tự đổi sau khi đã gắn API hoặc build lại dữ liệu tĩnh.</p>
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
                    <input name="price" type="number" min="0" step="500" value="{{ old('price', $product->price !== null ? (int) $product->price : 0) }}">
                    <span class="help">Giá cũ hiển thị dạng gạch ngang.</span>
                </label>
                <label>Giá khuyến mãi
                    <input name="sale_price" type="number" min="0" step="500" value="{{ old('sale_price', $product->sale_price !== null ? (int) $product->sale_price : '') }}">
                    <span class="help">Đây là giá đang bán. Để trống nếu không khuyến mãi.</span>
                </label>
                <label>Bảo hành
                    <input name="warranty_months" type="number" min="0" value="{{ old('warranty_months', $product->warranty_months ?? 12) }}">
                </label>
            </div>
            @error('price') <p class="error">{{ $message }}</p> @enderror
            @error('sale_price') <p class="error">{{ $message }}</p> @enderror
            @error('warranty_months') <p class="error">{{ $message }}</p> @enderror
        </div>

        <div class="card">
            <h2>Phiên bản và giá theo cấu hình</h2>
            <p class="help">Frontend chỉ đồng bộ giá theo các phiên bản này. Tên, ảnh, mô tả và layout frontend vẫn giữ nguyên.</p>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Phiên bản</th>
                            <th>SKU phiên bản</th>
                            <th>RAM</th>
                            <th>ROM</th>
                            <th>Giá niêm yết</th>
                            <th>Giá khuyến mãi</th>
                            <th>Nhãn</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($variantRows as $index => $variant)
                            <tr>
                                <td>
                                    <input type="hidden" name="variants[{{ $index }}][id]" value="{{ $variant['id'] ?? '' }}">
                                    <input type="hidden" name="variants[{{ $index }}][sort_order]" value="{{ $index }}">
                                    <input name="variants[{{ $index }}][label]" value="{{ $variant['label'] ?? '' }}" placeholder="RAM 4GB / ROM 64GB">
                                </td>
                                <td><input name="variants[{{ $index }}][sku]" value="{{ $variant['sku'] ?? '' }}" placeholder="TBOX-S2A-V2-4-64"></td>
                                <td><input name="variants[{{ $index }}][ram]" value="{{ $variant['ram'] ?? '' }}" placeholder="4GB"></td>
                                <td><input name="variants[{{ $index }}][rom]" value="{{ $variant['rom'] ?? '' }}" placeholder="64GB"></td>
                                <td><input name="variants[{{ $index }}][price]" type="number" min="0" step="500" value="{{ isset($variant['price']) && $variant['price'] !== null ? (int) $variant['price'] : '' }}"></td>
                                <td><input name="variants[{{ $index }}][sale_price]" type="number" min="0" step="500" value="{{ isset($variant['sale_price']) && $variant['sale_price'] !== null ? (int) $variant['sale_price'] : '' }}"></td>
                                <td><input name="variants[{{ $index }}][badge]" value="{{ $variant['badge'] ?? '' }}" placeholder="Bản tiêu chuẩn"></td>
                                <td>
                                    <select name="variants[{{ $index }}][status]">
                                        <option value="active" @selected(($variant['status'] ?? 'active') === 'active')>Đang bán</option>
                                        <option value="inactive" @selected(($variant['status'] ?? 'active') === 'inactive')>Ẩn</option>
                                    </select>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @error('variants.*.sku') <p class="error">{{ $message }}</p> @enderror
            @error('variants.*.price') <p class="error">{{ $message }}</p> @enderror
            @error('variants.*.sale_price') <p class="error">{{ $message }}</p> @enderror
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
