# Script d'aide pour l'installation PostgreSQL
Write-Host "🐘 Aide pour l'installation PostgreSQL - Tandem" -ForegroundColor Cyan

Write-Host "`n📋 ÉTAPES D'INSTALLATION:" -ForegroundColor Yellow
Write-Host "`n1️⃣ TÉLÉCHARGEMENT:" -ForegroundColor Cyan
Write-Host "   • Aller sur: https://www.postgresql.org/download/windows/" -ForegroundColor White
Write-Host "   • Télécharger PostgreSQL 15 ou 16 (version recommandée)" -ForegroundColor White
Write-Host "   • Taille: ~300 MB" -ForegroundColor Gray

Write-Host "`n2️⃣ INSTALLATION:" -ForegroundColor Cyan
Write-Host "   • Exécuter l'installateur en tant qu'administrateur" -ForegroundColor White
Write-Host "   • Choisir le port: 5432 (par défaut)" -ForegroundColor White
Write-Host "   • Mot de passe: postgres" -ForegroundColor White
Write-Host "   • Laisser toutes les autres options par défaut" -ForegroundColor White
Write-Host "   • Durée: ~5-10 minutes" -ForegroundColor Gray

Write-Host "`n3️⃣ VÉRIFICATION:" -ForegroundColor Cyan
Write-Host "   • PostgreSQL devrait démarrer automatiquement" -ForegroundColor White
Write-Host "   • Le service 'postgresql-x64-XX' devrait être actif" -ForegroundColor White
Write-Host "   • Test: psql --version" -ForegroundColor White

Write-Host "`n4️⃣ MIGRATION:" -ForegroundColor Cyan
Write-Host "   • Ouvrir PowerShell en tant qu'administrateur" -ForegroundColor White
Write-Host "   • Naviguer vers: cd C:\tandem" -ForegroundColor White
Write-Host "   • Exécuter: .\migrate-to-postgresql.ps1" -ForegroundColor White

Write-Host "`n🔧 SCRIPTS DISPONIBLES:" -ForegroundColor Yellow
Write-Host "   • .\install-postgresql.ps1 - Installation complète" -ForegroundColor White
Write-Host "   • .\migrate-to-postgresql.ps1 - Migration des données" -ForegroundColor White
Write-Host "   • .\test-postgresql.ps1 - Test rapide" -ForegroundColor White
Write-Host "   • .\aide-postgresql.ps1 - Cette aide" -ForegroundColor White

Write-Host "`n⚠️ IMPORTANT:" -ForegroundColor Red
Write-Host "   • Exécuter PowerShell en tant qu'administrateur" -ForegroundColor White
Write-Host "   • Être dans le répertoire C:\tandem" -ForegroundColor White
Write-Host "   • Avoir une connexion Internet pour le téléchargement" -ForegroundColor White

Write-Host "`n🎯 APRÈS INSTALLATION:" -ForegroundColor Green
Write-Host "   • Test: .\test-postgresql.ps1" -ForegroundColor White
Write-Host "   • Migration: .\migrate-to-postgresql.ps1" -ForegroundColor White
Write-Host "   • Démarrage: npm run dev" -ForegroundColor White

Write-Host "`n💡 BESOIN D'AIDE ?" -ForegroundColor Cyan
Write-Host "   • Relancez ce script: .\aide-postgresql.ps1" -ForegroundColor White
Write-Host "   • Documentation: https://www.postgresql.org/docs/" -ForegroundColor White












