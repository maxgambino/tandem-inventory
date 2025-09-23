# Script pour configurer la base de données PostgreSQL
Write-Host "🚀 Configuration de la base de données Tandem" -ForegroundColor Green

# Vérifier si PostgreSQL est installé
Write-Host "📋 Vérification de PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL trouvé: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "💡 Installez PostgreSQL depuis: https://www.postgresql.org/download/" -ForegroundColor Cyan
    exit 1
}

# Créer la base de données si elle n'existe pas
Write-Host "🗄️ Création de la base de données 'tandem'..." -ForegroundColor Yellow
try {
    createdb tandem 2>$null
    Write-Host "✅ Base de données 'tandem' créée ou existe déjà" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Impossible de créer la base de données automatiquement" -ForegroundColor Yellow
    Write-Host "💡 Créez manuellement: createdb tandem" -ForegroundColor Cyan
}

# Exécuter la migration
Write-Host "🔄 Exécution de la migration Prisma..." -ForegroundColor Yellow
try {
    npx prisma migrate deploy
    Write-Host "✅ Migration exécutée avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la migration" -ForegroundColor Red
    Write-Host "💡 Vérifiez que PostgreSQL est démarré et accessible" -ForegroundColor Cyan
    exit 1
}

# Générer le client Prisma
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✅ Client Prisma généré" -ForegroundColor Green

Write-Host "🎉 Base de données configurée avec succès !" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant démarrer le backend avec: npm run dev" -ForegroundColor Cyan







