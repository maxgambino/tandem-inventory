# Script pour tester l'API Tandem
Write-Host "🧪 Test de l'API Tandem" -ForegroundColor Green

$baseUrl = "http://localhost:4000"

# Test 1: Health check
Write-Host "1️⃣ Test du health check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Host "✅ Health check: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Liste des modules
Write-Host "2️⃣ Test de la liste des modules..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api" -UseBasicParsing
    Write-Host "✅ Modules API: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Modules API échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Liste des produits (devrait échouer sans DB)
Write-Host "3️⃣ Test de la liste des produits..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -UseBasicParsing
    Write-Host "✅ Produits API: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️ Produits API: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   (Normal si PostgreSQL n'est pas démarré)" -ForegroundColor Gray
}

Write-Host "🎯 Tests terminés !" -ForegroundColor Green







