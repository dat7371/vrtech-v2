# VRTECH Backend Local

Backend dang chay Laravel 12 voi PHP 8.3 portable trong thu muc repo goc:

```powershell
..\.tools\php-8.3-ts\php.exe
```

Dung cac script sau tu thu muc `vrtech-backend`:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\dev-server.ps1
```

Mo admin:

```text
http://127.0.0.1:8000/admin
```

Tai khoan admin local:

```text
Dat trong file .env local, khong commit len Git:
ADMIN_EMAIL=admin@vrtechnexus.vn
ADMIN_PASSWORD=mat_khau_manh_rieng
```

Seeder se tao hoac cap nhat tai khoan admin theo `ADMIN_EMAIL` va `ADMIN_PASSWORD`.
Khong hard-code mat khau admin trong source code.

Chay artisan bang PHP 8.3 portable:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\artisan-local.ps1 route:list
powershell -ExecutionPolicy Bypass -File scripts\artisan-local.ps1 migrate:fresh --seed
```

Chay Composer bang PHP 8.3 portable:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\composer-local.ps1 install
```

Telegram lead/order notification:

```env
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=token_moi_tu_BotFather
TELEGRAM_CHAT_ID=chat_id_cua_ban
TELEGRAM_VERIFY_SSL=true
```

Sau khi dien `TELEGRAM_BOT_TOKEN` vao `.env`, nhan `/start` voi bot roi lay chat id:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\artisan-local.ps1 telegram:chat-id
```

Sau khi dien `TELEGRAM_CHAT_ID`, gui thu tin test:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\artisan-local.ps1 telegram:test
```

Neu production da cache config, chay lai:

```bash
php artisan config:clear
php artisan optimize
```

Production tren cPanel nen dung PHP 8.3, MySQL, `APP_ENV=production`, `APP_DEBUG=false`, va chay:

```bash
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan storage:link
php artisan optimize
```
