<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FrontendAssetController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\WarrantyController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

Route::get('/kien-thuc', [PostController::class, 'index'])->name('posts.index');
Route::get('/kien-thuc/{slug}', [PostController::class, 'show'])->name('posts.show');
Route::get('/sitemap-posts.xml', [PostController::class, 'sitemap'])->name('posts.sitemap');

Route::get('/admin-assets/{path}', [FrontendAssetController::class, 'show'])
    ->where('path', '.*')
    ->name('admin.assets.show');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    });

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/', DashboardController::class)->name('dashboard');
        Route::resource('categories', CategoryController::class);
        Route::resource('products', ProductController::class);
        Route::resource('posts', AdminPostController::class);
        Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
        Route::patch('contacts/{contact}', [ContactController::class, 'update'])->name('contacts.update');
        Route::resource('orders', OrderController::class)->only(['index', 'show', 'update', 'destroy']);
        Route::resource('customers', CustomerController::class)->only(['index', 'show', 'update']);
        Route::resource('warranties', WarrantyController::class)->except(['show']);
    });
});
