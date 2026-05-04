@extends('admin.layouts.app')

@section('title', 'Danh mục')

@section('content')
    <div class="page-head">
        <div>
            <h1>Danh mục</h1>
            <p class="page-desc">Nhóm sản phẩm hiển thị trong admin và API.</p>
        </div>
        <a class="btn" href="{{ route('admin.categories.create') }}">Thêm danh mục</a>
    </div>

    <div class="card">
        <div class="table-wrap">
            <table>
                <thead><tr><th>Tên</th><th>Slug</th><th>Mô tả</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>
                @forelse ($categories as $category)
                    <tr>
                        <td><strong>{{ $category->name }}</strong></td>
                        <td>{{ $category->slug }}</td>
                        <td>{{ $category->description ?: '-' }}</td>
                        <td>{{ $category->sort_order }}</td>
                        <td><span class="badge {{ $category->status }}">{{ $category->status }}</span></td>
                        <td class="actions">
                            <a class="btn secondary" href="{{ route('admin.categories.edit', $category) }}">Sửa</a>
                            <form class="inline-form" method="post" action="{{ route('admin.categories.destroy', $category) }}" onsubmit="return confirm('Xóa danh mục này?')">
                                @csrf
                                @method('delete')
                                <button class="btn danger" type="submit">Xóa</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="6">Chưa có danh mục.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $categories->links() }}</div>
    </div>
@endsection
