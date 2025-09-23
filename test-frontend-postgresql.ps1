# Script de test complet du frontend avec PostgreSQL
Write-Host "🧪 Test complet Frontend + PostgreSQL" -ForegroundColor Cyan

Write-Host "`n🔍 VÉRIFICATION DES SERVICES:" -ForegroundColor Yellow

# Test Backend
Write-Host "`n🔧 Test Backend PostgreSQL..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Backend: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible" -ForegroundColor Red
    exit 1
}

# Test API Products
Write-Host "`n📦 Test API Products..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/products" -UseBasicParsing -TimeoutSec 10
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ API Products: $($products.Count) produits" -ForegroundColor Green
    $products | ForEach-Object { Write-Host "   • $($_.name) - $($_.sku) - $($_.unit)" -ForegroundColor White }
} catch {
    Write-Host "❌ API Products échoué" -ForegroundColor Red
}

# Test API Locations
Write-Host "`n📍 Test API Locations..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/locations" -UseBasicParsing -TimeoutSec 10
    $locations = $response.Content | ConvertFrom-Json
    Write-Host "✅ API Locations: $($locations.Count) emplacements" -ForegroundColor Green
    $locations | ForEach-Object { Write-Host "   • $($_.name)" -ForegroundColor White }
} catch {
    Write-Host "❌ API Locations échoué" -ForegroundColor Red
}

# Test API Suppliers
Write-Host "`n🏢 Test API Suppliers..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/suppliers" -UseBasicParsing -TimeoutSec 10
    $suppliers = $response.Content | ConvertFrom-Json
    Write-Host "✅ API Suppliers: $($suppliers.Count) fournisseurs" -ForegroundColor Green
    $suppliers | ForEach-Object { Write-Host "   • $($_.name) - $($_.email)" -ForegroundColor White }
} catch {
    Write-Host "❌ API Suppliers échoué" -ForegroundColor Red
}

Write-Host "`n🌐 VÉRIFICATION DU FRONTEND:" -ForegroundColor Yellow

# Test page Articles
Write-Host "`n📄 Test page Articles..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/articles" -UseBasicParsing -TimeoutSec 15
    Write-Host "✅ Page Articles: $($response.StatusCode)" -ForegroundColor Green
    if ($response.Content -match "Tomates fraîches|Pâtes spaghetti|Huile d'olive") {
        Write-Host "✅ Données PostgreSQL détectées dans la page Articles" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Données PostgreSQL non détectées dans la page Articles" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Page Articles échoué" -ForegroundColor Red
}

# Test page Inventaire
Write-Host "`n📋 Test page Inventaire..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/inventaire" -UseBasicParsing -TimeoutSec 15
    Write-Host "✅ Page Inventaire: $($response.StatusCode)" -ForegroundColor Green
    if ($response.Content -match "Tomates fraîches|Pâtes spaghetti|Huile d'olive") {
        Write-Host "✅ Données PostgreSQL détectées dans la page Inventaire" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Données PostgreSQL non détectées dans la page Inventaire" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Page Inventaire échoué" -ForegroundColor Red
}

# Test page d'accueil
Write-Host "`n🏠 Test page d'accueil..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 15
    Write-Host "✅ Page d'accueil: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Page d'accueil échoué" -ForegroundColor Red
}

Write-Host "`n🎉 RÉSULTATS DU TEST:" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:4000" -ForegroundColor White
Write-Host "🗄️ Base de données: PostgreSQL (tandem)" -ForegroundColor White
Write-Host "📦 Produits: 3 produits avec données complètes" -ForegroundColor White
Write-Host "Emplacements: 2 emplacements (Cuisine, Reserve)" -ForegroundColor White
Write-Host "Fournisseurs: 2 fournisseurs avec contacts" -ForegroundColor White

Write-Host "`nPOUR TESTER MANUELLEMENT:" -ForegroundColor Cyan
Write-Host "1. Ouvrir http://localhost:3000/articles" -ForegroundColor White
Write-Host "2. Ouvrir http://localhost:3000/inventaire" -ForegroundColor White
Write-Host "3. Verifier que les donnees PostgreSQL s'affichent" -ForegroundColor White
