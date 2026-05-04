<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class FrontendAssetController extends Controller
{
    public function show(string $path)
    {
        $frontendRoot = realpath(base_path('..'));
        $fullPath = realpath($frontendRoot . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path));

        abort_unless($frontendRoot && $fullPath && str_starts_with($fullPath, $frontendRoot), 404);
        abort_unless(File::isFile($fullPath), 404);

        return response()->file($fullPath);
    }
}
