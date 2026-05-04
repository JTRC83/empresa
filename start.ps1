# start.ps1 — Carga variables de .env y arranca OpenCode
#
# Uso: .\start.ps1
#      .\start.ps1 .      (abre el proyecto actual)

param(
  [string]$Mode = "."
)

$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
  Write-Host "🔑 Cargando variables de $envFile..." -ForegroundColor Cyan
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and $line -notmatch '^\s*#' -and $line -match '^([^=]+)=(.*)') {
      $name = $matches[1].Trim()
      $value = $matches[2].Trim()
      [Environment]::SetEnvironmentVariable($name, $value, "Process")
      Write-Host "   ✅ $name" -ForegroundColor Green
    }
  }
} else {
  Write-Host "⚠️  .env no encontrado en $PSScriptRoot" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Arrancando OpenCode..." -ForegroundColor Cyan
opencode $Mode
