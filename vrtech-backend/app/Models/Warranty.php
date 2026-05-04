<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warranty extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'product_id',
        'serial_number',
        'purchase_date',
        'activated_at',
        'expired_at',
        'status',
        'note',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'activated_at' => 'datetime',
        'expired_at' => 'date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
