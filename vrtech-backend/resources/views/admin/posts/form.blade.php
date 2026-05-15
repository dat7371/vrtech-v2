@extends('admin.layouts.app')

@section('title', $post->exists ? 'Sửa bài viết' : 'Thêm bài viết')

@section('content')
    <div class="page-head">
        <div>
            <h1>{{ $post->exists ? 'Sửa bài viết' : 'Thêm bài viết' }}</h1>
            <p class="page-desc">Dùng cho mục Kiến thức/blog SEO. Có thể thêm ảnh đại diện và link YouTube/TikTok.</p>
        </div>
        <a class="btn ghost" href="{{ route('admin.posts.index') }}">Quay lại</a>
    </div>

    <form method="post" action="{{ $post->exists ? route('admin.posts.update', $post) : route('admin.posts.store') }}" enctype="multipart/form-data">
        @csrf
        @if ($post->exists) @method('put') @endif

        <div class="card">
            <h2>Thông tin chính</h2>

            <div class="form-grid">
                <label>Trạng thái
                    <select name="status">
                        <option value="draft" @selected(old('status', $post->status) === 'draft')>Nháp</option>
                        <option value="published" @selected(old('status', $post->status) === 'published')>Xuất bản</option>
                    </select>
                </label>
                <label>Ngày xuất bản
                    <input name="published_at" type="datetime-local" value="{{ old('published_at', $post->published_at?->format('Y-m-d\TH:i')) }}">
                    <span class="help">Để trống vẫn có thể xuất bản ngay.</span>
                </label>
            </div>

            <label>Tiêu đề bài viết
                <input name="title" value="{{ old('title', $post->title) }}" required placeholder="Android Box ô tô là gì?">
            </label>
            @error('title') <p class="error">{{ $message }}</p> @enderror

            <label>Slug URL
                <input name="slug" value="{{ old('slug', $post->slug) }}" placeholder="android-box-o-to-la-gi">
                <span class="help">Nếu để trống, hệ thống tự tạo từ tiêu đề.</span>
            </label>
            @error('slug') <p class="error">{{ $message }}</p> @enderror

            <label>Mô tả ngắn
                <textarea name="excerpt" placeholder="Tóm tắt 1-2 câu để hiện trên danh sách bài viết và dùng cho SEO.">{{ old('excerpt', $post->excerpt) }}</textarea>
            </label>
            @error('excerpt') <p class="error">{{ $message }}</p> @enderror
        </div>

        <div class="card">
            <h2>Hình ảnh và video</h2>

            <label>Upload ảnh đại diện
                <input name="cover_image_file" type="file" accept="image/*">
                <span class="help">Nên dùng ảnh ngang hoặc vuông, dưới 4MB. Nếu upload ảnh mới, hệ thống sẽ ưu tiên ảnh này.</span>
            </label>
            @error('cover_image_file') <p class="error">{{ $message }}</p> @enderror

            <label>Hoặc dán URL/path ảnh đại diện
                <input name="cover_image" value="{{ old('cover_image', $post->cover_image) }}" placeholder="images/blog/android-box-o-to.webp">
            </label>
            @error('cover_image') <p class="error">{{ $message }}</p> @enderror

            @if ($post->resolved_cover_image)
                <p class="help">Ảnh hiện tại:</p>
                <img class="thumb" style="width:160px;height:100px;" src="{{ $post->resolved_cover_image }}" alt="">
            @endif

            <label>Link video YouTube/TikTok
                <input name="youtube_url" value="{{ old('youtube_url', $post->youtube_url) }}" placeholder="https://www.tiktok.com/@vrtechofficial/video/...">
                <span class="help">Hỗ trợ YouTube watch/shorts/embed và TikTok dạng @user/video. Trang bài viết sẽ tự nhúng video.</span>
            </label>
            @error('youtube_url') <p class="error">{{ $message }}</p> @enderror
        </div>

        <div class="card">
            <h2>Nội dung bài viết</h2>
            <label>Nội dung HTML
                <textarea name="content" style="min-height:420px;" placeholder="<h2>Android Box ô tô là gì?</h2>&#10;<p>Nội dung bài viết...</p>">{{ old('content', $post->content) }}</textarea>
                <span class="help">Có thể dùng thẻ HTML cơ bản như h2, h3, p, ul, li, strong, img, a. Video nên điền ở ô Link video phía trên.</span>
            </label>
            @error('content') <p class="error">{{ $message }}</p> @enderror
        </div>

        <div class="card">
            <h2>SEO</h2>
            <label>Meta title
                <input name="meta_title" value="{{ old('meta_title', $post->meta_title) }}" placeholder="Để trống sẽ dùng tiêu đề bài viết">
            </label>
            @error('meta_title') <p class="error">{{ $message }}</p> @enderror

            <label>Meta description
                <textarea name="meta_description" placeholder="Mô tả ngắn cho Google Search.">{{ old('meta_description', $post->meta_description) }}</textarea>
            </label>
            @error('meta_description') <p class="error">{{ $message }}</p> @enderror
        </div>

        <div class="actions">
            <button class="btn" type="submit">Lưu bài viết</button>
            <a class="btn ghost" href="{{ route('admin.posts.index') }}">Hủy</a>
        </div>
    </form>
@endsection
