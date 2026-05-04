<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30'],
            'car_model' => ['nullable', 'string', 'max:120'],
            'product_interest' => ['nullable', 'string', 'max:160'],
            'message' => ['nullable', 'string', 'max:2000'],
            'source' => ['nullable', 'string', 'max:80'],
        ]);

        $contact = Contact::create($data + [
            'source' => 'website',
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Contact received.',
            'data' => $contact,
        ], 201);
    }
}
