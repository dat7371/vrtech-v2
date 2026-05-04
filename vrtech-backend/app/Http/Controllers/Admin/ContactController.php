<?php

namespace App\Http\Controllers\Admin;

use App\Models\Contact;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return view('admin.contacts.index', [
            'contacts' => Contact::latest()->paginate(20),
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,contacted,quoted,closed'],
        ]);

        $contact->update($data);

        return back()->with('status', 'Da cap nhat lead.');
    }
}
