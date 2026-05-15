@php
    $title = $post->meta_title ?: $post->title;
    $description = $post->meta_description ?: $post->excerpt;
    $image = $post->absolute_cover_image ?: url('/images/products12thv2/all/TBOX%20V2%20SERIES.webp');
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'BlogPosting',
        'headline' => $post->title,
        'description' => $description,
        'image' => [$image],
        'datePublished' => optional($post->published_at)->toAtomString(),
        'dateModified' => $post->updated_at->toAtomString(),
        'author' => [
            '@type' => 'Organization',
            'name' => 'VRTECH',
        ],
        'publisher' => [
            '@type' => 'Organization',
            'name' => 'Carlinkit V2 by VRTECH',
            'logo' => [
                '@type' => 'ImageObject',
                'url' => url('/images/logo/favicon-vrtech.png'),
            ],
        ],
        'mainEntityOfPage' => $post->public_url,
    ];

    if ($post->video_embed_url) {
        $schema['video'] = [
            '@type' => 'VideoObject',
            'name' => $post->title,
            'description' => $description ?: $post->title,
            'thumbnailUrl' => [$image],
            'uploadDate' => optional($post->published_at)->toAtomString() ?: $post->created_at->toAtomString(),
            'embedUrl' => $post->video_embed_url,
        ];
    }
@endphp
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">
    <link rel="canonical" href="{{ $post->public_url }}">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" href="/favicon-48.png" sizes="48x48">
    <link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Carlinkit V2 by VRTECH">
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:url" content="{{ $post->public_url }}">
    <meta property="og:image" content="{{ $image }}">
    <script type="application/ld+json">@json($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)</script>
    <style>
        :root { --red:#a80010; --dark:#07090d; --ink:#111827; --muted:#667085; --line:#e5e7eb; --gold:#ffc24a; }
        * { box-sizing:border-box; }
        body { margin:0; font-family:Arial,sans-serif; color:var(--ink); background:#fff; }
        a { color:inherit; }
        .top { background:linear-gradient(90deg,#a00010,#090b10); color:#fff; }
        .top-inner { width:min(1080px,calc(100% - 32px)); margin:auto; min-height:76px; display:flex; align-items:center; justify-content:space-between; gap:18px; }
        .brand { display:flex; align-items:center; gap:14px; font-weight:900; text-decoration:none; }
        .brand img { width:168px; height:auto; display:block; }
        .nav { display:flex; gap:18px; flex-wrap:wrap; font-weight:800; }
        .nav a { color:#fff; text-decoration:none; }
        .article { width:min(1080px,calc(100% - 32px)); margin:44px auto 72px; }
        .article h1 { margin:0 0 14px; font-size:44px; line-height:1.08; letter-spacing:0; }
        .meta { color:var(--muted); font-weight:700; margin-bottom:22px; }
        .excerpt { color:#344054; font-size:20px; line-height:1.6; margin:0 0 28px; }
        .cover { width:min(820px,100%); height:auto; border-radius:14px; margin:0 auto 28px; display:block; object-fit:contain; background:#f8fafc; }
        .video { position:relative; aspect-ratio:16/9; margin:0 0 30px; border-radius:14px; overflow:hidden; background:#111; }
        .video.tiktok { width:min(560px,100%); aspect-ratio:9/16; margin-left:auto; margin-right:auto; }
        .video iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
        .video-link { display:flex; justify-content:center; margin:-14px 0 30px; }
        .video-link a { display:inline-flex; min-height:42px; align-items:center; justify-content:center; padding:0 16px; border-radius:999px; background:#111827; color:#fff; text-decoration:none; font-weight:900; }
        .content { font-size:18px; line-height:1.75; }
        .content h2 { font-size:30px; line-height:1.2; margin:36px 0 12px; }
        .content h3 { font-size:23px; margin:28px 0 10px; }
        .content p { margin:0 0 16px; }
        .content ul, .content ol { padding-left:24px; margin:0 0 18px; }
        .content img { max-width:100%; height:auto; border-radius:12px; }
        .cta { margin-top:36px; padding:22px; background:#fff7e6; border:1px solid #fedf89; border-radius:12px; }
        .cta strong { display:block; font-size:22px; margin-bottom:8px; }
        .cta a { display:inline-flex; margin-top:12px; min-height:42px; align-items:center; padding:0 16px; border-radius:8px; background:var(--red); color:#fff; text-decoration:none; font-weight:900; }
        @media (max-width:640px) { .top-inner { align-items:flex-start; flex-direction:column; padding:18px 0; } .article h1 { font-size:34px; } .content { font-size:17px; } }
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
                <a href="/kien-thuc">Kiến thức</a>
                <a href="/index.html#products">Sản phẩm</a>
                <a href="/index.html#contact">Liên hệ</a>
            </nav>
        </div>
    </header>

    <main class="article">
        <article>
            <h1>{{ $post->title }}</h1>
            <div class="meta">{{ $post->published_at?->format('d/m/Y') }} · VRTECH</div>

            @if ($post->excerpt)
                <p class="excerpt">{{ $post->excerpt }}</p>
            @endif

            @if ($post->resolved_cover_image)
                <img class="cover" src="{{ $post->resolved_cover_image }}" alt="{{ $post->title }}">
            @endif

            @if ($post->video_embed_url)
                <div class="video {{ $post->video_provider === 'tiktok' ? 'tiktok' : '' }}">
                    <iframe src="{{ $post->video_embed_url }}" title="{{ $post->title }}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
                </div>
                @if ($post->video_provider === 'tiktok' && $post->video_source_url)
                    <div class="video-link">
                        <a href="{{ $post->video_source_url }}" target="_blank" rel="noopener noreferrer">Xem video trên TikTok</a>
                    </div>
                @endif
            @endif

            <div class="content">
                {!! $post->content !!}
            </div>

            <div class="cta">
                <strong>Cần tư vấn Carlinkit V2 phù hợp với xe?</strong>
                <p>Gửi dòng xe hoặc gọi VRTECH để được kiểm tra khả năng tương thích trước khi chọn bản S2A, S2P, PLUS, AMBIENT hoặc ULTRA MAX.</p>
                <a href="/index.html#contact">Liên hệ tư vấn</a>
            </div>
        </article>
    </main>
</body>
</html>
