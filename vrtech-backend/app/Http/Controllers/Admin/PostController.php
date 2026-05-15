<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index()
    {
        return view('admin.posts.index', [
            'posts' => Post::latest('updated_at')->paginate(20),
        ]);
    }

    public function create()
    {
        return view('admin.posts.form', [
            'post' => new Post([
                'status' => 'draft',
                'published_at' => now(),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        Post::create($data);

        return redirect()->route('admin.posts.index')->with('status', 'Đã tạo bài viết.');
    }

    public function edit(Post $post)
    {
        return view('admin.posts.form', compact('post'));
    }

    public function update(Request $request, Post $post)
    {
        $data = $this->validated($request, $post);

        $post->update($data);

        return redirect()->route('admin.posts.index')->with('status', 'Đã cập nhật bài viết.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')->with('status', 'Đã xóa bài viết.');
    }

    private function validated(Request $request, ?Post $post = null): array
    {
        $ignoreId = $post?->id;

        $data = $request->validate([
            'title' => ['required', 'string', 'max:220'],
            'slug' => ['nullable', 'string', 'max:240', 'unique:posts,slug' . ($ignoreId ? ',' . $ignoreId : '')],
            'excerpt' => ['nullable', 'string', 'max:1200'],
            'content' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500'],
            'cover_image_file' => ['nullable', 'image', 'max:4096'],
            'youtube_url' => ['nullable', 'url', 'max:500'],
            'meta_title' => ['nullable', 'string', 'max:220'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
        ]);

        if ($request->hasFile('cover_image_file')) {
            $data['cover_image'] = Storage::disk('public')->putFile('blog', $request->file('cover_image_file'));
            $data['cover_image'] = 'storage/' . $data['cover_image'];
        }

        unset($data['cover_image_file']);

        $data['slug'] = $data['slug']
            ? Str::slug($data['slug'])
            : $this->uniqueSlug($data['title'], $post);
        $data['published_at'] = $data['status'] === 'published'
            ? ($data['published_at'] ?? now())
            : ($data['published_at'] ?? null);

        return $data;
    }

    private function uniqueSlug(string $title, ?Post $post = null): string
    {
        $base = Str::slug($title) ?: 'bai-viet';
        $slug = $base;
        $index = 2;

        while (Post::where('slug', $slug)
            ->when($post, fn ($query) => $query->whereKeyNot($post->id))
            ->exists()) {
            $slug = $base . '-' . $index;
            $index++;
        }

        return $slug;
    }
}
