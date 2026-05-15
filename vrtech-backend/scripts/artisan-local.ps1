$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$php = Resolve-Path (Join-Path $root "..\.tools\php-8.3-ts\php.exe")
$sqlite = Join-Path $root "database\database.sqlite"

if (!(Test-Path $sqlite)) {
    New-Item -ItemType File -Path $sqlite | Out-Null
}

if (!$env:DB_CONNECTION) {
    $env:DB_CONNECTION = "sqlite"
}

if (!$env:DB_DATABASE) {
    $env:DB_DATABASE = $sqlite
}

if (!$env:CACHE_DRIVER) {
    $env:CACHE_DRIVER = "array"
}

Set-Location $root
& $php artisan @args
