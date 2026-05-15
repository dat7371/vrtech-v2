@extends('admin.layouts.app')

@section('title', 'Đăng nhập admin')

@section('content')
    <div class="card" style="max-width: 420px; margin: 48px auto;">
        <h1>Đăng nhập admin</h1>
        <form method="post" action="{{ route('admin.login.store') }}">
            @csrf
            <label>Email</label>
            <input name="email" type="email" value="{{ old('email') }}" required>
            @error('email') <p class="error">{{ $message }}</p> @enderror

            <label>Mật khẩu</label>
            <input name="password" type="password" required>
            @error('password') <p class="error">{{ $message }}</p> @enderror

            <label><input name="remember" type="checkbox" value="1" style="width:auto;"> Ghi nhớ đăng nhập</label>
            <button class="btn" type="submit">Đăng nhập</button>
        </form>
    </div>
@endsection
