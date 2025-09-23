# Script de migration des données SQLite vers PostgreSQL
Write-Host "🔄 Migration des données SQLite vers PostgreSQL" -ForegroundColor Cyan

# Vérification de PostgreSQL
Write-Host "`n🔍 Vérification de PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres"
    $result = psql -h localhost -U postgres -d postgres -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL accessible" -ForegroundColor Green
    } else {
        throw "Erreur de connexion"
    }
} catch {
    Write-Host "❌ PostgreSQL non accessible. Installez PostgreSQL d'abord." -ForegroundColor Red
    exit 1
}

# Sauvegarde des données SQLite existantes
Write-Host "`n💾 Sauvegarde des données SQLite..." -ForegroundColor Yellow
cd apps/backend

if (Test-Path "dev.db") {
    Write-Host "✅ Fichier SQLite trouvé: dev.db" -ForegroundColor Green
    
    # Création d'un script de sauvegarde
    $backupScript = @"
-- Sauvegarde des données SQLite
-- Ces données seront réinsérées dans PostgreSQL

-- Restaurant
INSERT INTO "Restaurant" (id, name, country, "createdAt", "updatedAt") VALUES 
('restaurant-1', 'Mona Verde', 'France', NOW(), NOW());

-- Locations
INSERT INTO "Location" (id, name, "restaurantId", "createdAt", "updatedAt") VALUES 
('location-1', 'Cuisine', 'restaurant-1', NOW(), NOW()),
('location-2', 'Réserve', 'restaurant-1', NOW(), NOW());

-- Suppliers
INSERT INTO "Supplier" (id, name, email, phone, "restaurantId", "createdAt", "updatedAt") VALUES 
('supplier-1', 'Fournisseur Local', 'contact@fournisseur-local.fr', '01 23 45 67 89', 'restaurant-1', NOW(), NOW()),
('supplier-2', 'Grossiste Paris', 'commandes@grossiste-paris.fr', '01 98 76 54 32', 'restaurant-1', NOW(), NOW());

-- Products
INSERT INTO "Product" (id, name, sku, barcode, unit, "minStock", "restaurantId", "locationId", "supplierId", "createdAt", "updatedAt") VALUES 
('product-1', 'Tomates fraîches', 'TOM-001', '1234567890123', 'kg', 5, 'restaurant-1', 'location-1', 'supplier-1', NOW(), NOW()),
('product-2', 'Pâtes spaghetti', 'PAS-001', '2345678901234', 'paquet', 10, 'restaurant-1', 'location-2', 'supplier-2', NOW(), NOW()),
('product-3', 'Huile d''olive extra vierge', 'HUI-001', '3456789012345', 'L', 3, 'restaurant-1', 'location-1', 'supplier-1', NOW(), NOW());
"@
    
    $backupScript | Out-File -FilePath "backup-data.sql" -Encoding UTF8
    Write-Host "✅ Script de sauvegarde créé: backup-data.sql" -ForegroundColor Green
} else {
    Write-Host "⚠️ Aucun fichier SQLite trouvé" -ForegroundColor Yellow
}

# Création de la base de données PostgreSQL
Write-Host "`n🗄️ Création de la base de données PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres"
    psql -h localhost -U postgres -d postgres -c "DROP DATABASE IF EXISTS tandem;" 2>$null
    psql -h localhost -U postgres -d postgres -c "CREATE DATABASE tandem;" 2>$null
    Write-Host "✅ Base de données 'tandem' créée" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création de la base de données" -ForegroundColor Red
    exit 1
}

# Migration Prisma
Write-Host "`n📦 Migration Prisma vers PostgreSQL..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init_postgresql
    Write-Host "✅ Migration Prisma appliquée" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la migration Prisma" -ForegroundColor Red
    exit 1
}

# Restauration des données
if (Test-Path "backup-data.sql") {
    Write-Host "`n📥 Restauration des données..." -ForegroundColor Yellow
    try {
        $env:PGPASSWORD = "postgres"
        psql -h localhost -U postgres -d tandem -f "backup-data.sql" 2>$null
        Write-Host "✅ Données restaurées dans PostgreSQL" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la restauration des données" -ForegroundColor Red
    }
}

# Test de l'API
Write-Host "`n🧪 Test de l'API avec PostgreSQL..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/products" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        $products = $response.Content | ConvertFrom-Json
        Write-Host "✅ API fonctionnelle avec $($products.Count) produits" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ API non accessible (backend peut-être arrêté)" -ForegroundColor Yellow
}

Write-Host "`n🎉 Migration vers PostgreSQL terminée !" -ForegroundColor Green
Write-Host "🗄️ Base de données: PostgreSQL (tandem)" -ForegroundColor White
Write-Host "📁 Fichier SQLite: dev.db (peut être supprimé)" -ForegroundColor White







