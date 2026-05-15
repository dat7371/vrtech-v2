<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $keyword = trim((string) $request->query('q', ''));

        return view('admin.contacts.index', [
            'contacts' => Contact::query()
                ->when($status, fn ($query) => $query->where('status', $status))
                ->when($keyword !== '', function ($query) use ($keyword) {
                    $query->where(function ($query) use ($keyword) {
                        $query->where('name', 'like', "%{$keyword}%")
                            ->orWhere('phone', 'like', "%{$keyword}%")
                            ->orWhere('car_model', 'like', "%{$keyword}%")
                            ->orWhere('product_interest', 'like', "%{$keyword}%");
                    });
                })
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'status' => $status,
            'keyword' => $keyword,
            'statuses' => $this->statuses(),
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,contacted,quoted,closed,ignored'],
        ]);

        $contact->update($data);

        return back()->with('status', 'Đã cập nhật lead.');
    }

    private function statuses(): array
    {
        return [
            'new' => 'Mới',
            'contacted' => 'Đã gọi',
            'quoted' => 'Đã báo giá',
            'closed' => 'Đã chốt',
            'ignored' => 'Bỏ qua',
        ];
    }
}
