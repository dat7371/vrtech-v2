<?php

namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        return view('posts.index', [
            'posts' => Post::published()->latest('published_at')->paginate(12),
        ]);
    }

    public function show(string $slug)
    {
        $post = Post::published()->where('slug', $slug)->firstOrFail();

        return view('posts.show', compact('post'));
    }

    public function sitemap()
    {
        $posts = Post::published()->latest('updated_at')->get();
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($posts as $post) {
            $xml .= "    <url>\n";
            $xml .= '        <loc>' . e($post->public_url) . "</loc>\n";
            $xml .= '        <lastmod>' . $post->updated_at->toAtomString() . "</lastmod>\n";
            $xml .= "        <changefreq>monthly</changefreq>\n";
            $xml .= "        <priority>0.7</priority>\n";
            $xml .= "    </url>\n";
        }

        $xml .= '</urlset>' . "\n";

        return response()
            ->make($xml)
            ->header('Content-Type', 'application/xml');
    }
}
