<?php

namespace App\Support;

class SerialNumber
{
    public static function normalize(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        return strtoupper($value);
    }

    public static function isValid(?string $value): bool
    {
        $value = self::normalize($value);

        if ($value === null) {
            return false;
        }

        return preg_match('/^VRTECH-[A-Z0-9]+-\d{6}$/', $value) === 1;
    }

    public static function validationMessage(): string
    {
        return 'Serial phải đúng định dạng VRTECH-MODEL-000001 với 6 chữ số cuối.';
    }
}
