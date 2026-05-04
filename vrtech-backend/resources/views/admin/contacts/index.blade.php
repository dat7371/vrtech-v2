@extends('admin.layouts.app')

@section('title', 'Lead tư vấn')

@section('content')
    <div class="page-head">
        <div>
            <h1>Lead tư vấn</h1>
            <p class="page-desc">Khách gửi form từ website. Cập nhật trạng thái sau khi gọi hoặc báo giá.</p>
        </div>
    </div>

    <div class="card">
        <div class="table-wrap">
            <table>
                <thead><tr><th>Khách</th><th>Xe</th><th>Sản phẩm quan tâm</th><th>Nhu cầu</th><th>Trạng thái</th><th>Nguồn</th><th>Ngày tạo</th></tr></thead>
                <tbody>
                @forelse ($contacts as $contact)
                    <tr>
                        <td><strong>{{ $contact->name }}</strong><br><span class="text-muted">{{ $contact->phone }}</span></td>
                        <td>{{ $contact->car_model ?: '-' }}</td>
                        <td>{{ $contact->product_interest ?: 'Cần tư vấn' }}</td>
                        <td style="max-width: 320px;">{{ $contact->message ?: '-' }}</td>
                        <td>
                            <form class="inline-form" method="post" action="{{ route('admin.contacts.update', $contact) }}">
                                @csrf
                                @method('patch')
                                <select name="status" onchange="this.form.submit()">
                                    <option value="new" @selected($contact->status === 'new')>Mới</option>
                                    <option value="contacted" @selected($contact->status === 'contacted')>Đã gọi</option>
                                    <option value="quoted" @selected($contact->status === 'quoted')>Đã báo giá</option>
                                    <option value="closed" @selected($contact->status === 'closed')>Đóng</option>
                                </select>
                            </form>
                        </td>
                        <td><span class="badge">{{ $contact->source }}</span></td>
                        <td>{{ $contact->created_at?->format('d/m/Y H:i') }}</td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="7">Chưa có lead từ website.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
        <div class="pagination">{{ $contacts->links() }}</div>
    </div>
@endsection
