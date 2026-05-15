<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kiến thức Carlinkit V2 và Android Box ô tô | VRTECH</title>
    <meta name="description" content="Bài viết kiến thức về Android Box ô tô, Carlinkit V2, Carlinkit chính hãng VRTECH, Apple CarPlay, Android Auto và kinh nghiệm chọn thiết bị cho xe.">
    <link rel="canonical" href="{{ url('/kien-thuc') }}">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48">
    <link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <style>
        :root { --red:#a80010; --dark:#07090d; --ink:#111827; --muted:#667085; --line:#e5e7eb; --gold:#ffc24a; }
        * { box-sizing: border-box; }
        body { margin:0; font-family: Arial, sans-serif; color:var(--ink); background:#f7f8fb; }
        a { color:inherit; text-decoration:none; }
        .top { background:linear-gradient(90deg,#a00010,#090b10); color:#fff; }
        .top-inner { width:min(1120px,calc(100% - 32px)); margin:auto; min-height:76px; display:flex; align-items:center; justify-content:space-between; gap:18px; }
        .brand { display:flex; align-items:center; gap:14px; font-weight:900; }
        .brand img { width:168px; height:auto; display:block; }
        .nav { display:flex; gap:18px; flex-wrap:wrap; font-weight:800; }
        .hero { width:min(1120px,calc(100% - 32px)); margin:42px auto 28px; }
        .hero h1 { margin:0; font-size:42px; line-height:1.08; }
        .hero p { max-width:760px; color:var(--muted); font-size:18px; line-height:1.6; }
        .grid { width:min(1120px,calc(100% - 32px)); margin:0 auto 60px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; }
        .card { background:#fff; border:1px solid var(--line); border-radius:12px; overflow:hidden; box-shadow:0 14px 32px rgba(15,23,42,.06); }
        .thumb { width:100%; aspect-ratio:16/10; object-fit:cover; background:#111; display:block; }
        .card-body { padding:18px; }
        .date { color:var(--red); font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:.04em; }
        .card h2 { margin:8px 0 10px; font-size:22px; line-height:1.18; }
        .card p { margin:0; color:var(--muted); line-height:1.55; }
        .empty { width:min(1120px,calc(100% - 32px)); margin:0 auto 60px; padding:30px; background:#fff; border:1px solid var(--line); border-radius:12px; color:var(--muted); }
        .pagination { width:min(1120px,calc(100% - 32px)); margin:0 auto 60px; }
        .pagination nav { display:flex; gap:8px; flex-wrap:wrap; }
        .pagination a, .pagination span { display:inline-flex; min-height:36px; min-width:36px; align-items:center; justify-content:center; padding:0 12px; border:1px solid var(--line); background:#fff; border-radius:8px; }
        @media (max-width:900px) { .grid { grid-template-columns:1fr 1fr; } .hero h1 { font-size:34px; } }
        @media (max-width:640px) { .grid { grid-template-columns:1fr; } .top-inner { align-items:flex-start; flex-direction:column; padding:18px 0; } }
    </style>
</head>
<body>
    <header class="top">
        <div class="top-inner">
            <a class="brand" href="/">
                <img src="/images/logo/LOGO%20VRTECH-02.png" alt="Carlinkit VN Store x VRTECH">
                <span>Kiến thức</span>
            </a>
            <nav class="nav" aria-label="Điều hướng">
                <a href="/">Trang chủ</a>
                <a href="/index.html#products">Sản phẩm</a>
                <a href="/index.html#contact">Liên hệ</a>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <h1>Kiến thức Carlinkit V2 và Android Box ô tô</h1>
            <p>Hướng dẫn chọn Android Box ô tô, phân biệt Carlinkit chính hãng, kinh nghiệm dùng Apple CarPlay, Android Auto và các mẹo tối ưu trải nghiệm trên xe.</p>
        </section>

        @php
            $staticPosts = [
                [
                    'title' => 'Android Box ô tô là gì? Ưu nhược điểm và có nên lắp không?',
                    'url' => '/pages/android-box-o-to-la-gi.html',
                    'excerpt' => 'Tổng quan dễ hiểu về Android Box ô tô, ưu nhược điểm, xe tương thích và cách chọn thiết bị phù hợp.',
                    'image' => '/images/products12thv2/all/TBOX%20V2%20SERIES.webp',
                ],
                [
                    'title' => 'Carlinkit V2 là gì?',
                    'url' => '/pages/carlinkit-v2-la-gi.html',
                    'excerpt' => 'Giải thích Carlinkit V2, các phiên bản TBOX V2 và điểm khác biệt trong hệ sản phẩm VRTECH.',
                    'image' => '/images/products12thv2/all/TBOX%20V2%20SERIES.webp',
                ],
                [
                    'title' => 'Carlinkit VRTECH chính hãng',
                    'url' => '/pages/carlinkit-vrtech-chinh-hang.html',
                    'excerpt' => 'Các dấu hiệu nhận biết Carlinkit chính hãng VRTECH, bảo hành điện tử và quyền lợi khi mua hàng.',
                    'image' => '/images/logo/LOGO%20VRTECH-02.png',
                ],
                [
                    'title' => 'So sánh các bản Carlinkit V2',
                    'url' => '/pages/so-sanh-carlinkit-s2a-s2p-plus-ambient-ultra.html',
                    'excerpt' => 'So sánh nhanh S2A, S2P, PLUS, AMBIENT và ULTRA MAX để chọn đúng phiên bản theo nhu cầu.',
                    'image' => '/images/products12thv2/all/TBOX%20V2%20SERIES.webp',
                ],
            ];
        @endphp

        @if ($posts->count() || count($staticPosts))
            <section class="grid" aria-label="Danh sách bài viết">
                @foreach ($posts as $post)
                    <article class="card">
                        <a href="{{ route('posts.show', $post->slug) }}">
                            @if ($post->resolved_cover_image)
                                <img class="thumb" src="{{ $post->resolved_cover_image }}" alt="{{ $post->title }}" loading="lazy">
                            @else
                                <span class="thumb"></span>
                            @endif
                            <div class="card-body">
                                <span class="date">{{ $post->published_at?->format('d/m/Y') }}</span>
                                <h2>{{ $post->title }}</h2>
                                <p>{{ $post->excerpt }}</p>
                            </div>
                        </a>
                    </article>
                @endforeach

                @foreach ($staticPosts as $staticPost)
                    <article class="card">
                        <a href="{{ $staticPost['url'] }}">
                            <img class="thumb" src="{{ $staticPost['image'] }}" alt="{{ $staticPost['title'] }}" loading="lazy">
                            <div class="card-body">
                                <span class="date">Bài viết</span>
                                <h2>{{ $staticPost['title'] }}</h2>
                                <p>{{ $staticPost['excerpt'] }}</p>
                            </div>
                        </a>
                    </article>
                @endforeach
            </section>
            @if ($posts->hasPages())
                <div class="pagination">{{ $posts->links() }}</div>
            @endif
        @else
            <div class="empty">Chưa có bài viết được xuất bản.</div>
        @endif
    </main>
</body>
</html>
