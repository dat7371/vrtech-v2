@extends('admin.layouts.app')

@section('title', 'Dang nhap admin')

@section('content')
    <div class="card" style="max-width: 420px; margin: 48px auto;">
        <h1>Dang nhap admin</h1>
        <form method="post" action="{{ route('admin.login.store') }}">
            @csrf
            <label>Email</label>
            <input name="email" type="email" value="{{ old('email') }}" required>
            @error('email') <p class="error">{{ $message }}</p> @enderror

            <label>Mat khau</label>
            <input name="password" type="password" required>
            @error('password') <p class="error">{{ $message }}</p> @enderror

            <label><input name="remember" type="checkbox" value="1" style="width:auto;"> Ghi nho dang nhap</label>
            <button class="btn" type="submit">Dang nhap</button>
        </form>
    </div>
@endsection
