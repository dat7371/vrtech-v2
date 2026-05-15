<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'VRTECH Admin')</title>
    <link rel="icon" type="image/png" href="/images/logo/favicon-vrtech.png">
    <link rel="apple-touch-icon" href="/images/logo/favicon-vrtech.png">
    <style>
        :root {
            --bg: #f4f6f8;
            --ink: #111827;
            --muted: #667085;
            --line: #e5e7eb;
            --panel: #ffffff;
            --nav: #07090d;
            --red: #e50914;
            --gold: #ffc24a;
            --green: #039855;
            --blue: #0f5db8;
            --radius: 8px;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; background: var(--bg); color: var(--ink); }
        a { color: inherit; text-decoration: none; }
        button, input, select, textarea { font: inherit; }
        .shell { min-height: 100vh; display: grid; grid-template-columns: 248px minmax(0, 1fr); }
        .sidebar { background: var(--nav); color: #fff; padding: 22px 16px; position: sticky; top: 0; height: 100vh; }
        .brand { display: grid; grid-template-columns: 96px minmax(0, 1fr); align-items: center; gap: 12px; padding: 0 8px 22px; border-bottom: 1px solid rgba(255,255,255,.1); }
        .brand-logo {
            width: 96px;
            height: 52px;
            object-fit: contain;
            border-radius: 8px;
            background:
                linear-gradient(90deg, rgba(148,0,10,.96) 0%, rgba(82,2,10,.76) 55%, rgba(14,10,12,.94) 100%),
                #080a0c;
            padding: 7px 9px;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), 0 10px 22px rgba(0,0,0,.22);
        }
        .brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 8px; background: linear-gradient(135deg, var(--red), #98000a); color: #fff; font-weight: 900; }
        .brand strong { display: block; font-size: 17px; line-height: 1.1; }
        .brand span { display: block; margin-top: 3px; color: #aeb7c2; font-size: 12px; }
        .nav { display: grid; gap: 6px; margin-top: 22px; }
        .nav a { display: flex; align-items: center; justify-content: space-between; min-height: 42px; padding: 0 12px; border-radius: var(--radius); color: #d8dee8; font-weight: 700; }
        .nav a:hover, .nav a.active { color: #fff; background: rgba(229, 9, 20, .18); }
        .nav small { color: #ffe08a; font-weight: 800; }
        .main { min-width: 0; }
        .topbar { height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 28px; background: #fff; border-bottom: 1px solid var(--line); }
        .topbar-title strong { display: block; font-size: 16px; }
        .topbar-title span { display: block; color: var(--muted); font-size: 13px; margin-top: 3px; }
        .wrap { width: min(1240px, calc(100% - 56px)); margin: 28px auto 48px; }
        .page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
        h1 { margin: 0; font-size: 30px; letter-spacing: 0; }
        h2 { margin: 0 0 16px; font-size: 20px; }
        .page-desc { margin: 7px 0 0; color: var(--muted); }
        .card { background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius); padding: 20px; margin-bottom: 18px; box-shadow: 0 12px 28px rgba(15, 23, 42, .04); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; }
        .metric { min-height: 116px; position: relative; overflow: hidden; }
        .metric::after { content: ""; position: absolute; inset: auto 18px 0 auto; width: 58px; height: 4px; border-radius: 999px; background: linear-gradient(90deg, var(--red), var(--gold)); }
        .metric strong { display: block; font-size: 32px; line-height: 1; margin-bottom: 10px; }
        .metric span { color: var(--muted); font-weight: 700; }
        .metric small { display: block; color: var(--muted); margin-top: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 760px; }
        th, td { border-bottom: 1px solid var(--line); padding: 13px 12px; text-align: left; vertical-align: middle; }
        th { background: #f8fafc; color: #344054; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
        tbody tr:hover { background: #fafafa; }
        label { display: grid; gap: 7px; margin: 13px 0; font-weight: 800; color: #344054; }
        .help { color: var(--muted); font-size: 13px; font-weight: 500; line-height: 1.45; }
        input, select, textarea { width: 100%; border: 1px solid #d0d5dd; border-radius: var(--radius); padding: 11px 12px; background: #fff; color: var(--ink); }
        textarea { min-height: 116px; resize: vertical; }
        input:focus, select:focus, textarea:focus { outline: 0; border-color: var(--red); box-shadow: 0 0 0 3px rgba(229, 9, 20, .12); }
        .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; }
        .form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .filters { display: grid; grid-template-columns: minmax(220px, 1fr) 220px auto; gap: 10px; align-items: end; margin-bottom: 16px; }
        .btn { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: var(--radius); padding: 0 14px; background: var(--red); color: #fff; cursor: pointer; font-weight: 800; }
        .btn.small { min-height: 34px; padding: 0 11px; font-size: 13px; }
        .btn.secondary { background: #344054; }
        .btn.ghost { background: #fff; color: #344054; border: 1px solid #d0d5dd; }
        .btn.danger { background: #b42318; }
        .btn.gold { background: #b77900; }
        .status { padding: 12px 14px; background: #ecfdf3; border: 1px solid #abefc6; border-radius: var(--radius); margin-bottom: 16px; color: #027a48; font-weight: 700; }
        .error { color: #b42318; font-size: 14px; margin: 0; }
        .badge { display: inline-flex; align-items: center; min-height: 26px; padding: 0 9px; border-radius: 999px; font-size: 12px; font-weight: 900; background: #f2f4f7; color: #344054; }
        .badge.active, .badge.contacted, .badge.activated { background: #ecfdf3; color: #027a48; }
        .badge.new { background: #fff4e5; color: #b77900; }
        .badge.inactive, .badge.closed, .badge.expired, .badge.cancelled, .badge.ignored { background: #fef3f2; color: #b42318; }
        .badge.quoted, .badge.confirmed, .badge.processing { background: #eff8ff; color: #175cd3; }
        .badge.completed { background: #ecfdf3; color: #027a48; }
        .text-muted { color: var(--muted); }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
        .summary-item { border: 1px solid var(--line); border-radius: var(--radius); padding: 14px; background: #fbfcfe; }
        .summary-item span { display: block; color: var(--muted); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
        .summary-item strong { display: block; font-size: 17px; }
        .thumb { width: 56px; height: 56px; object-fit: contain; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; }
        .inline-form { margin: 0; }
        .logout { margin: 0; }
        .empty { padding: 28px; color: var(--muted); text-align: center; }
        .pagination { margin-top: 16px; }
        .pagination nav { display: flex; gap: 8px; }
        @media (max-width: 920px) {
            .shell { grid-template-columns: 1fr; }
            .sidebar { position: static; height: auto; }
            .nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .brand { grid-template-columns: 96px minmax(0, 1fr); }
            .wrap { width: min(100% - 28px, 1240px); }
            .form-grid, .form-grid.three { grid-template-columns: 1fr; }
            .filters { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="shell">
        <aside class="sidebar">
            <a class="brand" href="{{ route('admin.dashboard') }}">
                <img class="brand-logo" src="/images/logo/LOGO%20VRTECH-02.png" alt="VRTECH">
                <span>
                    <strong>VRTECH Admin</strong>
                    <span>Carlinkit V2 / Bảo hành</span>
                </span>
            </a>
            @auth
                <nav class="nav" aria-label="Điều hướng admin">
                    <a class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">Tổng quan</a>
                    <a class="{{ request()->routeIs('admin.products.*') ? 'active' : '' }}" href="{{ route('admin.products.index') }}">Sản phẩm <small>API</small></a>
                    <a class="{{ request()->routeIs('admin.posts.*') ? 'active' : '' }}" href="{{ route('admin.posts.index') }}">Bài viết <small>SEO</small></a>
                    <a class="{{ request()->routeIs('admin.categories.*') ? 'active' : '' }}" href="{{ route('admin.categories.index') }}">Danh mục</a>
                    <a class="{{ request()->routeIs('admin.contacts.*') ? 'active' : '' }}" href="{{ route('admin.contacts.index') }}">Lead tư vấn</a>
                    <a class="{{ request()->routeIs('admin.orders.*') ? 'active' : '' }}" href="{{ route('admin.orders.index') }}">Đơn hàng</a>
                    <a class="{{ request()->routeIs('admin.customers.*') ? 'active' : '' }}" href="{{ route('admin.customers.index') }}">Khách hàng</a>
                    <a class="{{ request()->routeIs('admin.warranties.*') ? 'active' : '' }}" href="{{ route('admin.warranties.index') }}">Bảo hành</a>
                </nav>
            @endauth
        </aside>

        <div class="main">
            <header class="topbar">
                <div class="topbar-title">
                    <strong>@yield('title', 'VRTECH Admin')</strong>
                    <span>Quản trị nội dung, lead, sản phẩm và bảo hành điện tử</span>
                </div>
                @auth
                    <form class="logout" method="post" action="{{ route('admin.logout') }}">
                        @csrf
                        <button class="btn secondary" type="submit">Đăng xuất</button>
                    </form>
                @endauth
            </header>

            <main class="wrap">
                @if (session('status'))
                    <div class="status">{{ session('status') }}</div>
                @endif
                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>
