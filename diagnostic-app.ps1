# Script de diagnostic pour l'application Tandem
Write-Host "🔍 Diagnostic de l'application Tandem" -ForegroundColor Cyan

Write-Host "`n📊 Vérification des processus Node.js:" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object { Write-Host "   Processus Node.js: PID $($_.Id)" -ForegroundColor White }
} else {
    Write-Host "   Aucun processus Node.js en cours" -ForegroundColor Yellow
}

Write-Host "`n🌐 Test de connectivité:" -ForegroundColor Yellow
Write-Host "`n📱 Test Frontend (port 3000):" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔧 Test Backend (port 4000):" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📦 Test API Products:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/products" -UseBasicParsing -TimeoutSec 5
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ API Products: $($products.Count) produits" -ForegroundColor Green
} catch {
    Write-Host "❌ API Products: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔧 Vérification des ports:" -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port4000 = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "✅ Port 3000: Occupé" -ForegroundColor Green
} else {
    Write-Host "❌ Port 3000: Libre" -ForegroundColor Red
}

if ($port4000) {
    Write-Host "✅ Port 4000: Occupé" -ForegroundColor Green
} else {
    Write-Host "❌ Port 4000: Libre" -ForegroundColor Red
}

Write-Host "`n💡 Recommandations:" -ForegroundColor Cyan
if (-not $port3000 -and -not $port4000) {
    Write-Host "   • Redémarrer l'application avec: npm run dev" -ForegroundColor White
} elseif ($port3000 -and -not $port4000) {
    Write-Host "   • Redémarrer le backend uniquement" -ForegroundColor White
} elseif (-not $port3000 -and $port4000) {
    Write-Host "   • Redémarrer le frontend uniquement" -ForegroundColor White
} else {
    Write-Host "   • Vérifier les logs d'erreur dans les terminaux" -ForegroundColor White
}








