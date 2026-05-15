<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'youtube_url',
        'meta_title',
        'meta_description',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function scopePublished($query)
    {
        return $query
            ->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

    public function getPublicUrlAttribute(): string
    {
        return url('/kien-thuc/' . $this->slug);
    }

    public function getResolvedCoverImageAttribute(): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        if (Str::startsWith($this->cover_image, ['http://', 'https://', '/'])) {
            return $this->cover_image;
        }

        return '/' . ltrim(str_replace('\\', '/', $this->cover_image), '/');
    }

    public function getAbsoluteCoverImageAttribute(): ?string
    {
        if (! $this->resolved_cover_image) {
            return null;
        }

        if (Str::startsWith($this->resolved_cover_image, ['http://', 'https://'])) {
            return $this->resolved_cover_image;
        }

        return url($this->resolved_cover_image);
    }

    public function getVideoEmbedUrlAttribute(): ?string
    {
        if (! $this->youtube_url) {
            return null;
        }

        $url = trim($this->youtube_url);

        if (preg_match('~tiktok\.com/(?:@[^/]+/video|embed/v2|player/v1)/(\d+)~', $url, $matches)) {
            return 'https://www.tiktok.com/player/v1/' . $matches[1];
        }

        if (preg_match('~youtube\.com/embed/([A-Za-z0-9_-]{6,})~', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        if (preg_match('~youtu\.be/([A-Za-z0-9_-]{6,})~', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        if (preg_match('~youtube\.com/shorts/([A-Za-z0-9_-]{6,})~', $url, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        $parts = parse_url($url);
        if (! empty($parts['query'])) {
            parse_str($parts['query'], $query);
            if (! empty($query['v']) && preg_match('~^[A-Za-z0-9_-]{6,}$~', $query['v'])) {
                return 'https://www.youtube.com/embed/' . $query['v'];
            }
        }

        return null;
    }

    public function getYoutubeEmbedUrlAttribute(): ?string
    {
        return $this->video_embed_url;
    }

    public function getVideoProviderAttribute(): ?string
    {
        if (! $this->youtube_url) {
            return null;
        }

        return str_contains($this->youtube_url, 'tiktok.com') ? 'tiktok' : 'youtube';
    }

    public function getVideoSourceUrlAttribute(): ?string
    {
        return $this->youtube_url ? trim($this->youtube_url) : null;
    }
}
