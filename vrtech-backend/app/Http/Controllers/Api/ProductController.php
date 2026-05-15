<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return Product::query()
            ->with(['category', 'images', 'activeVariants'])
            ->where('status', 'active')
            ->latest()
            ->paginate(20);
    }

    public function show(string $slug)
    {
        $product = Product::query()
            ->with(['category', 'images', 'activeVariants'])
            ->where('status', 'active')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json(['data' => $product]);
    }
}
