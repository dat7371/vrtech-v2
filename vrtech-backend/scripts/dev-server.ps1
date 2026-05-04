$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$php = Resolve-Path (Join-Path $root "..\.tools\php-8.3-ts\php.exe")
$sqlite = Join-Path $root "database\database.sqlite"

if (!(Test-Path $sqlite)) {
    New-Item -ItemType File -Path $sqlite | Out-Null
}

$env:DB_CONNECTION = "sqlite"
$env:DB_DATABASE = $sqlite

Set-Location $root
& $php artisan serve --host=127.0.0.1 --port=8000
