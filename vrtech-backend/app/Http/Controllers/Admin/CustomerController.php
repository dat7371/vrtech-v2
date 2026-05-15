<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Support\PhoneNumber;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $keyword = trim((string) $request->query('q', ''));

        $customers = Customer::query()
            ->withCount(['orders', 'warranties'])
            ->when($keyword !== '', function ($query) use ($keyword) {
                $query->where(function ($query) use ($keyword) {
                    $query->where('name', 'like', "%{$keyword}%")
                        ->orWhere('phone', 'like', "%{$keyword}%")
                        ->orWhere('email', 'like', "%{$keyword}%")
                        ->orWhere('car_model', 'like', "%{$keyword}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.customers.index', [
            'customers' => $customers,
            'keyword' => $keyword,
        ]);
    }

    public function show(Customer $customer)
    {
        return view('admin.customers.show', [
            'customer' => $customer->load([
                'orders' => fn ($query) => $query->latest()->with('items'),
                'warranties' => fn ($query) => $query->latest()->with('product'),
            ]),
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => [
                'required',
                'string',
                'max:30',
                fn ($attribute, $value, $fail) => PhoneNumber::isValid($value) ? null : $fail(PhoneNumber::validationMessage()),
            ],
            'email' => ['nullable', 'email', 'max:160'],
            'car_model' => ['nullable', 'string', 'max:120'],
            'address' => ['nullable', 'string', 'max:1000'],
            'note' => ['nullable', 'string', 'max:2000'],
        ]);
        $data['phone'] = PhoneNumber::normalize($data['phone']);

        $customer->update($data);

        return redirect()->route('admin.customers.show', $customer)->with('status', 'Đã cập nhật khách hàng.');
    }
}
