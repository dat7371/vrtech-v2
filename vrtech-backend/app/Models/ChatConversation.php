<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatConversation extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'session_id', 'status', 'metadata'];

    protected $casts = ['metadata' => 'array'];
}
