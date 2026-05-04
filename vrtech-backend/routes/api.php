<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WarrantyController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1');
Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:10,1');
Route::post('/warranty/check', [WarrantyController::class, 'check'])->middleware('throttle:20,1');
