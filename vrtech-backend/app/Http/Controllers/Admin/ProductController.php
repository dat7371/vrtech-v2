<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.products.index', [
            'products' => Product::with(['category', 'variants'])->latest()->paginate(20),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.products.form', [
            'product' => new Product(['status' => 'active', 'warranty_months' => 12]),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $this->validated($request);
        $variants = $data['variants'];
        unset($data['variants']);

        $product = Product::create($data);
        $this->syncVariants($product, $variants);

        return redirect()->route('admin.products.index')->with('status', 'Đã tạo sản phẩm.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return redirect()->route('admin.products.edit', $id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return view('admin.products.form', [
            'product' => Product::with('variants')->findOrFail($id),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $this->validated($request, $product->id);
        $variants = $data['variants'];
        unset($data['variants']);

        $product->update($data);
        $this->syncVariants($product, $variants);

        return redirect()->route('admin.products.index')->with('status', 'Đã cập nhật sản phẩm.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return redirect()->route('admin.products.index')->with('status', 'Đã xóa sản phẩm.');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $normalizedVariants = collect($request->input('variants', []))
            ->map(function ($variant) {
                $variant['price'] = $this->normalizeMoneyInput($variant['price'] ?? null);
                $variant['sale_price'] = $this->normalizeMoneyInput($variant['sale_price'] ?? null);

                return $variant;
            })
            ->all();

        $request->merge([
            'price' => $this->normalizeMoneyInput($request->input('price')),
            'sale_price' => $this->normalizeMoneyInput($request->input('sale_price')),
            'variants' => $normalizedVariants,
        ]);

        $data = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200', 'unique:products,slug' . ($ignoreId ? ',' . $ignoreId : '')],
            'sku' => ['nullable', 'string', 'max:120', 'unique:products,sku' . ($ignoreId ? ',' . $ignoreId : '')],
            'short_description' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'cpu' => ['nullable', 'string', 'max:120'],
            'ram' => ['nullable', 'string', 'max:120'],
            'rom' => ['nullable', 'string', 'max:120'],
            'os' => ['nullable', 'string', 'max:120'],
            'warranty_months' => ['nullable', 'integer', 'min:0', 'max:120'],
            'main_image' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'in:active,inactive'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.label' => ['nullable', 'string', 'max:120'],
            'variants.*.sku' => ['nullable', 'string', 'max:120'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.sale_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.ram' => ['nullable', 'string', 'max:60'],
            'variants.*.rom' => ['nullable', 'string', 'max:60'],
            'variants.*.badge' => ['nullable', 'string', 'max:120'],
            'variants.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'variants.*.status' => ['nullable', 'in:active,inactive'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);
        $data['price'] = $data['price'] ?? 0;
        $data['warranty_months'] = $data['warranty_months'] ?? 12;
        $data['variants'] = collect($data['variants'] ?? [])
            ->filter(fn ($variant) => filled($variant['label'] ?? null))
            ->values()
            ->all();

        return $data;
    }

    private function syncVariants(Product $product, array $variants): void
    {
        $keptIds = [];

        foreach ($variants as $index => $variant) {
            $payload = [
                'label' => $variant['label'],
                'sku' => $variant['sku'] ?? null,
                'price' => $variant['price'] ?? 0,
                'sale_price' => $variant['sale_price'] ?? null,
                'ram' => $variant['ram'] ?? null,
                'rom' => $variant['rom'] ?? null,
                'badge' => $variant['badge'] ?? null,
                'sort_order' => $variant['sort_order'] ?? $index,
                'status' => $variant['status'] ?? 'active',
            ];

            if (! empty($variant['id'])) {
                $productVariant = $product->variants()->whereKey($variant['id'])->first();

                if ($productVariant) {
                    $productVariant->update($payload);
                    $keptIds[] = $productVariant->id;
                    continue;
                }
            }

            $productVariant = $product->variants()->create($payload);
            $keptIds[] = $productVariant->id;
        }

        if ($keptIds) {
            $product->variants()->whereNotIn('id', $keptIds)->delete();
        } else {
            $product->variants()->delete();
        }
    }

    private function normalizeMoneyInput(mixed $value): mixed
    {
        if ($value === null || $value === '') {
            return $value;
        }

        if (is_numeric($value)) {
            return $value;
        }

        $raw = trim((string) $value);

        if (str_contains($raw, '.') && str_contains($raw, ',')) {
            $normalized = str_replace('.', '', $raw);
            $normalized = str_replace(',', '.', $normalized);
        } elseif (str_contains($raw, ',')) {
            $parts = explode(',', $raw);
            $normalized = count($parts) > 2 || strlen(end($parts)) === 3
                ? str_replace(',', '', $raw)
                : str_replace(',', '.', $raw);
        } else {
            $normalized = str_replace('.', '', $raw);
        }

        return is_numeric($normalized) ? $normalized : $value;
    }
}
