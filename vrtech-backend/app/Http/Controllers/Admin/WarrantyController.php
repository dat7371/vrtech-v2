<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Warranty;
use App\Support\PhoneNumber;
use App\Support\SerialNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class WarrantyController extends Controller
{
    public function index()
    {
        return view('admin.warranties.index', [
            'warranties' => Warranty::with(['customer', 'product'])->latest()->paginate(20),
        ]);
    }

    public function create()
    {
        return view('admin.warranties.form', [
            'warranty' => new Warranty(['status' => 'active']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $customer = $this->findOrCreateCustomer($data);

        Warranty::create($this->warrantyPayload($data, $customer));

        return redirect()->route('admin.warranties.index')->with('status', 'Đã kích hoạt bảo hành.');
    }

    public function edit(Warranty $warranty)
    {
        return view('admin.warranties.form', [
            'warranty' => $warranty->load('customer'),
            'products' => Product::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Warranty $warranty)
    {
        $data = $this->validated($request, $warranty->id);
        $customer = $this->findOrCreateCustomer($data);

        $warranty->update($this->warrantyPayload($data, $customer));

        return redirect()->route('admin.warranties.index')->with('status', 'Đã cập nhật bảo hành.');
    }

    public function destroy(Warranty $warranty)
    {
        $warranty->delete();

        return redirect()->route('admin.warranties.index')->with('status', 'Đã xóa bảo hành.');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => [
                'required',
                'string',
                'max:30',
                fn ($attribute, $value, $fail) => PhoneNumber::isValid($value) ? null : $fail(PhoneNumber::validationMessage()),
            ],
            'car_model' => ['nullable', 'string', 'max:120'],
            'product_id' => ['required', 'exists:products,id'],
            'serial_number' => [
                'required',
                'string',
                'max:120',
                'unique:warranties,serial_number' . ($ignoreId ? ',' . $ignoreId : ''),
                fn ($attribute, $value, $fail) => SerialNumber::isValid($value) ? null : $fail(SerialNumber::validationMessage()),
            ],
            'purchase_date' => ['nullable', 'date'],
            'activated_at' => ['nullable', 'date'],
            'expired_at' => ['nullable', 'date'],
            'status' => ['required', 'in:active,expired,cancelled'],
            'note' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    private function findOrCreateCustomer(array $data): Customer
    {
        return Customer::updateOrCreate(
            ['phone' => PhoneNumber::normalize($data['customer_phone'])],
            [
                'name' => $data['customer_name'],
                'car_model' => $data['car_model'] ?? null,
            ]
        );
    }

    private function warrantyPayload(array $data, Customer $customer): array
    {
        $product = Product::findOrFail($data['product_id']);
        $activatedAt = isset($data['activated_at']) ? Carbon::parse($data['activated_at']) : now();
        $expiredAt = isset($data['expired_at'])
            ? Carbon::parse($data['expired_at'])
            : $activatedAt->copy()->addMonths((int) $product->warranty_months)->toDateString();

        return [
            'customer_id' => $customer->id,
            'product_id' => $product->id,
            'serial_number' => SerialNumber::normalize($data['serial_number']),
            'purchase_date' => $data['purchase_date'] ?? null,
            'activated_at' => $activatedAt,
            'expired_at' => $expiredAt,
            'status' => $data['status'],
            'note' => $data['note'] ?? null,
        ];
    }
}
