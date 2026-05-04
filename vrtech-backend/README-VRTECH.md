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

Tai khoan seed local:

```text
Dat trong file .env local:
ADMIN_EMAIL=admin@vrtech.local
ADMIN_PASSWORD=
```

Chay artisan bang PHP 8.3 portable:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\artisan-local.ps1 route:list
powershell -ExecutionPolicy Bypass -File scripts\artisan-local.ps1 migrate:fresh --seed
```

Chay Composer bang PHP 8.3 portable:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\composer-local.ps1 install
```

Production tren cPanel nen dung PHP 8.3, MySQL, `APP_ENV=production`, `APP_DEBUG=false`, va chay:

```bash
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan storage:link
php artisan optimize
```
