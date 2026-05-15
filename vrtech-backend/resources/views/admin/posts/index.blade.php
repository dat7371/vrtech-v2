@extends('admin.layouts.app')

@section('title', 'Bài viết')

@section('content')
    <div class="page-head">
        <div>
            <h1>Bài viết</h1>
            <p class="page-desc">Quản lý bài kiến thức/blog SEO. Bài đã xuất bản sẽ hiện ở /kien-thuc.</p>
        </div>
        <a class="btn" href="{{ route('admin.posts.create') }}">Thêm bài viết</a>
    </div>

    <div class="card">
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Bài viết</th>
                        <th>Trạng thái</th>
                        <th>Ngày xuất bản</th>
                        <th>Video</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                @forelse ($posts as $post)
                    <tr>
                        <td>
                            <div class="actions" style="flex-wrap:nowrap;">
                                @if ($post->resolved_cover_image)
                                    <img class="thumb" src="{{ $post->resolved_cover_image }}" alt="">
                                @else
                                    <span class="thumb" style="display:grid;place-items:center;font-weight:900;color:#e50914;">SEO</span>
                                @endif
                                <span>
                                    <strong>{{ $post->title }}</strong><br>
                                    <span class="text-muted">/kien-thuc/{{ $post->slug }}</span>
                                </span>
                            </div>
                        </td>
                        <td><span class="badge {{ $post->status === 'published' ? 'active' : 'new' }}">{{ $post->status === 'published' ? 'published' : 'draft' }}</span></td>
                        <td>{{ $post->published_at?->format('d/m/Y H:i') ?: '-' }}</td>
                        <td>{{ $post->youtube_url ? 'Có' : '-' }}</td>
                        <td class="actions">
                            @if ($post->status === 'published')
                                <a class="btn ghost" href="{{ route('posts.show', $post->slug) }}" target="_blank" rel="noopener">Xem</a>
                            @endif
                            <a class="btn secondary" href="{{ route('admin.posts.edit', $post) }}">Sửa</a>
                            <form class="inline-form" method="post" action="{{ route('admin.posts.destroy', $post) }}" onsubmit="return confirm('Xóa bài viết này?')">
                                @csrf
                                @method('delete')
                                <button class="btn danger" type="submit">Xóa</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="5">Chưa có bài viết. Hãy thêm bài kiến thức đầu tiên.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $posts->links() }}</div>
    </div>
@endsection
