<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatLead extends Model
{
    use HasFactory;

    protected $fillable = ['chat_conversation_id', 'name', 'phone', 'product_interest', 'note', 'status'];
}
