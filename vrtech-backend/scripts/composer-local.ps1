$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$php = Resolve-Path (Join-Path $root "..\.tools\php-8.3-ts\php.exe")
$composer = Resolve-Path (Join-Path $root "..\.tools\composer.phar")

Set-Location $root
& $php $composer @args
