<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Support\PhoneNumber;
use App\Support\TelegramNotifier;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => [
                'required',
                'string',
                'max:30',
                fn ($attribute, $value, $fail) => PhoneNumber::isValid($value) ? null : $fail(PhoneNumber::validationMessage()),
            ],
            'car_model' => ['nullable', 'string', 'max:120'],
            'product_interest' => ['nullable', 'string', 'max:160'],
            'message' => ['nullable', 'string', 'max:2000'],
            'source' => ['nullable', 'string', 'max:80'],
        ]);
        $data['phone'] = PhoneNumber::normalize($data['phone']);

        $contact = Contact::create([
            ...$data,
            'source' => 'website',
            'status' => 'new',
        ]);

        app(TelegramNotifier::class)->notifyContact($contact);

        return response()->json([
            'message' => 'Contact received.',
            'data' => $contact,
        ], 201);
    }
}
