<?php

namespace App\Support;

class PhoneNumber
{
    public static function normalize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $value);

        return $digits === '' ? null : $digits;
    }

    public static function isValid(?string $value): bool
    {
        $digits = self::normalize($value);

        return is_string($digits) && preg_match('/^0\d{9}$/', $digits) === 1;
    }

    public static function validationMessage(): string
    {
        return 'Số điện thoại phải đủ đúng 10 chữ số, ví dụ 0866 955 966.';
    }
}
