@extends('admin.layouts.app')

@section('title', $category->exists ? 'Sửa danh mục' : 'Thêm danh mục')

@section('content')
    <div class="page-head">
        <div>
            <h1>{{ $category->exists ? 'Sửa danh mục' : 'Thêm danh mục' }}</h1>
            <p class="page-desc">Ví dụ: Android Box Carlinkit, Phụ kiện, Ứng dụng dẫn đường.</p>
        </div>
        <a class="btn ghost" href="{{ route('admin.categories.index') }}">Quay lại</a>
    </div>

    <div class="card">
        <form method="post" action="{{ $category->exists ? route('admin.categories.update', $category) : route('admin.categories.store') }}">
            @csrf
            @if ($category->exists) @method('put') @endif

            <div class="form-grid">
                <label>Tên danh mục
                    <input name="name" value="{{ old('name', $category->name) }}" required>
                </label>
                <label>Slug
                    <input name="slug" value="{{ old('slug', $category->slug) }}">
                </label>
            </div>
            @error('name') <p class="error">{{ $message }}</p> @enderror
            @error('slug') <p class="error">{{ $message }}</p> @enderror

            <label>Mô tả
                <textarea name="description">{{ old('description', $category->description) }}</textarea>
            </label>

            <div class="form-grid">
                <label>Thứ tự
                    <input name="sort_order" type="number" min="0" value="{{ old('sort_order', $category->sort_order ?? 0) }}">
                </label>
                <label>Trạng thái
                    <select name="status">
                        <option value="active" @selected(old('status', $category->status) === 'active')>Đang hiển thị</option>
                        <option value="inactive" @selected(old('status', $category->status) === 'inactive')>Ẩn khỏi API</option>
                    </select>
                </label>
            </div>

            <p class="actions">
                <button class="btn" type="submit">Lưu danh mục</button>
                <a class="btn ghost" href="{{ route('admin.categories.index') }}">Hủy</a>
            </p>
        </form>
    </div>
@endsection
