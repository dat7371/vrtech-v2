<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'email', 'car_model', 'address', 'note'];

    public function warranties()
    {
        return $this->hasMany(Warranty::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
