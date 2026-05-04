<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Models\Contact;
use App\Models\Order;
use App\Models\Product;
use App\Models\Warranty;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return view('admin.dashboard', [
            'categoryCount' => Category::count(),
            'productCount' => Product::count(),
            'newContactCount' => Contact::where('status', 'new')->count(),
            'warrantyCount' => Warranty::count(),
            'orderCount' => Order::count(),
            'activeProductCount' => Product::where('status', 'active')->count(),
            'latestContacts' => Contact::latest()->take(8)->get(),
            'latestWarranties' => Warranty::with(['customer', 'product'])->latest()->take(6)->get(),
        ]);
    }
}
