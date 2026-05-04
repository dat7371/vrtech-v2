<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = ['chat_conversation_id', 'sender', 'message', 'metadata'];

    protected $casts = ['metadata' => 'array'];
}
