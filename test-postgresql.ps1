# Script de test rapide pour PostgreSQL
Write-Host "🧪 Test rapide de PostgreSQL pour Tandem" -ForegroundColor Cyan

# Test de connexion PostgreSQL
Write-Host "`n🔍 Test de connexion PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres"
    $result = psql -h localhost -U postgres -d postgres -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL accessible" -ForegroundColor Green
    } else {
        throw "Erreur de connexion"
    }
} catch {
    Write-Host "❌ PostgreSQL non accessible" -ForegroundColor Red
    Write-Host "Vérifiez que PostgreSQL est installé et démarré" -ForegroundColor Yellow
    exit 1
}

# Test de la base de données tandem
Write-Host "`n🗄️ Test de la base de données 'tandem'..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres"
    $result = psql -h localhost -U postgres -d tandem -c "SELECT COUNT(*) FROM \"Product\";" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données 'tandem' accessible" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Base de données 'tandem' non trouvée" -ForegroundColor Yellow
        Write-Host "Exécutez d'abord: .\migrate-to-postgresql.ps1" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Erreur d'accès à la base de données" -ForegroundColor Red
}

# Test de l'API backend
Write-Host "`n🔧 Test de l'API backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Backend non accessible (peut-être arrêté)" -ForegroundColor Yellow
    Write-Host "Démarrez le backend avec: npm run dev" -ForegroundColor Cyan
}

# Test de l'API products
Write-Host "`n📦 Test de l'API products..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/products" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $products = $response.Content | ConvertFrom-Json
        Write-Host "✅ API products accessible avec $($products.Count) produits" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ API products non accessible" -ForegroundColor Yellow
}

Write-Host "`n🎉 Test terminé !" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:4000" -ForegroundColor White






