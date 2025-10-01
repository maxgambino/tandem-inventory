# Script d'installation et configuration PostgreSQL pour Tandem
Write-Host "🐘 Installation et configuration PostgreSQL pour Tandem" -ForegroundColor Cyan

# Vérification si PostgreSQL est déjà installé
Write-Host "`n🔍 Vérification de PostgreSQL..." -ForegroundColor Yellow
try {
    $version = psql --version
    Write-Host "✅ PostgreSQL déjà installé: $version" -ForegroundColor Green
    $postgresInstalled = $true
} catch {
    Write-Host "❌ PostgreSQL non trouvé" -ForegroundColor Red
    $postgresInstalled = $false
}

if (-not $postgresInstalled) {
    Write-Host "`n📥 PostgreSQL n'est pas installé." -ForegroundColor Yellow
    Write-Host "Veuillez installer PostgreSQL manuellement :" -ForegroundColor Cyan
    Write-Host "1. Télécharger depuis: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Installer avec les paramètres par défaut" -ForegroundColor White
    Write-Host "3. Mot de passe: postgres" -ForegroundColor White
    Write-Host "4. Port: 5432" -ForegroundColor White
    Write-Host "`nAppuyez sur Entrée une fois l'installation terminée..." -ForegroundColor Yellow
    Read-Host
}

# Vérification de la connexion PostgreSQL
Write-Host "`n🔧 Test de connexion PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres"
    $result = psql -h localhost -U postgres -d postgres -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connexion PostgreSQL réussie" -ForegroundColor Green
    } else {
        throw "Erreur de connexion"
    }
} catch {
    Write-Host "❌ Impossible de se connecter à PostgreSQL" -ForegroundColor Red
    Write-Host "Vérifiez que PostgreSQL est démarré et accessible" -ForegroundColor Yellow
    exit 1
}

# Création de la base de données tandem
Write-Host "`n🗄️ Création de la base de données 'tandem'..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres"
    psql -h localhost -U postgres -d postgres -c "CREATE DATABASE tandem;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données 'tandem' créée" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Base de données 'tandem' existe peut-être déjà" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors de la création de la base de données" -ForegroundColor Red
    exit 1
}

# Génération du client Prisma
Write-Host "`n🔧 Génération du client Prisma..." -ForegroundColor Yellow
cd apps/backend
try {
    npx prisma generate
    Write-Host "✅ Client Prisma généré" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Création de la migration
Write-Host "`n📦 Création de la migration PostgreSQL..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init_postgresql
    Write-Host "✅ Migration PostgreSQL créée et appliquée" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la migration" -ForegroundColor Red
    exit 1
}

# Test de l'API
Write-Host "`n🧪 Test de l'API avec PostgreSQL..." -ForegroundColor Yellow
Write-Host "Démarrage du backend..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend démarré avec PostgreSQL" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erreur lors du test du backend" -ForegroundColor Red
}

Write-Host "`n🎉 Configuration PostgreSQL terminée !" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend: http://localhost:4000" -ForegroundColor White
Write-Host "🗄️ Base de données: PostgreSQL (tandem)" -ForegroundColor White













