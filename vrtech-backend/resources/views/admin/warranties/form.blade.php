@extends('admin.layouts.app')

@section('title', $warranty->exists ? 'Sửa bảo hành' : 'Kích hoạt bảo hành')

@section('content')
    <div class="page-head">
        <div>
            <h1>{{ $warranty->exists ? 'Sửa bảo hành' : 'Kích hoạt bảo hành' }}</h1>
            <p class="page-desc">Dữ liệu này dùng cho API tra cứu bằng số điện thoại hoặc serial.</p>
        </div>
        <a class="btn ghost" href="{{ route('admin.warranties.index') }}">Quay lại</a>
    </div>

    <form method="post" action="{{ $warranty->exists ? route('admin.warranties.update', $warranty) : route('admin.warranties.store') }}">
        @csrf
        @if ($warranty->exists) @method('put') @endif

        <div class="card">
            <h2>Thông tin khách hàng</h2>
            <div class="form-grid">
                <label>Tên khách
                    <input name="customer_name" value="{{ old('customer_name', $warranty->customer?->name) }}" required>
                </label>
                <label>Số điện thoại
                    <input name="customer_phone" value="{{ old('customer_phone', $warranty->customer?->phone) }}" required>
                </label>
                <label>Dòng xe
                    <input name="car_model" value="{{ old('car_model', $warranty->customer?->car_model) }}" placeholder="Mazda 3, Vios, CR-V...">
                </label>
            </div>
        </div>

        <div class="card">
            <h2>Thiết bị và thời hạn</h2>
            <div class="form-grid">
                <label>Sản phẩm
                    <select name="product_id" required>
                        <option value="">Chọn sản phẩm</option>
                        @foreach ($products as $product)
                            <option value="{{ $product->id }}" @selected((int) old('product_id', $warranty->product_id) === $product->id)>{{ $product->name }}</option>
                        @endforeach
                    </select>
                </label>
                <label>Serial number
                    <input name="serial_number" value="{{ old('serial_number', $warranty->serial_number) }}" placeholder="VRTECH-S2P-000001" required>
                </label>
            </div>
            @error('serial_number') <p class="error">{{ $message }}</p> @enderror

            <div class="form-grid three">
                <label>Ngày mua
                    <input name="purchase_date" type="date" value="{{ old('purchase_date', $warranty->purchase_date?->format('Y-m-d')) }}">
                </label>
                <label>Ngày kích hoạt
                    <input name="activated_at" type="date" value="{{ old('activated_at', $warranty->activated_at?->format('Y-m-d')) }}">
                </label>
                <label>Ngày hết hạn
                    <input name="expired_at" type="date" value="{{ old('expired_at', $warranty->expired_at?->format('Y-m-d')) }}">
                </label>
            </div>

            <label>Trạng thái
                <select name="status">
                    <option value="active" @selected(old('status', $warranty->status) === 'active')>Còn bảo hành</option>
                    <option value="expired" @selected(old('status', $warranty->status) === 'expired')>Hết hạn</option>
                    <option value="cancelled" @selected(old('status', $warranty->status) === 'cancelled')>Hủy</option>
                </select>
            </label>

            <label>Ghi chú hỗ trợ
                <textarea name="note">{{ old('note', $warranty->note) }}</textarea>
            </label>
        </div>

        <div class="actions">
            <button class="btn" type="submit">Lưu bảo hành</button>
            <a class="btn ghost" href="{{ route('admin.warranties.index') }}">Hủy</a>
        </div>
    </form>
@endsection
