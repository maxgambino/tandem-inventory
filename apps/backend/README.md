# Tandem Backend API

API backend pour le système de gestion d'inventaire Tandem.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Installation
```bash
npm install
```

### Configuration de la base de données

1. **Installer PostgreSQL** (si pas déjà fait)
   - Windows: https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql postgresql-contrib`

2. **Démarrer PostgreSQL**
   ```bash
   # Windows (si installé comme service)
   net start postgresql-x64-14
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Configurer la base de données**
   ```bash
   # Option 1: Script automatique
   .\setup-database.ps1
   
   # Option 2: Manuel
   createdb tandem
   npx prisma migrate deploy
   npx prisma generate
   ```

### Démarrage
```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## 📊 Base de données

### Modèles
- **Restaurant**: Restaurant principal
- **Location**: Emplacements dans le restaurant
- **Product**: Produits avec SKU, code-barres, stock minimum
- **Supplier**: Fournisseurs

### Migration
```bash
# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations
npx prisma migrate deploy

# Réinitialiser la base (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

## 🔗 API Endpoints

- `GET /health` - Health check
- `GET /api` - Liste des modules disponibles
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `GET /api/products/:id` - Détails d'un produit

## 🛠️ Développement

### Structure
```
src/
├── index.ts          # Point d'entrée
├── api/
│   ├── index.ts      # Routeur principal
│   ├── products.ts   # Routes produits
│   ├── locations.ts  # Routes emplacements
│   └── suppliers.ts  # Routes fournisseurs
```

### Ajouter une nouvelle route
1. Créer le fichier dans `src/api/`
2. L'importer dans `src/api/index.ts`
3. Ajouter les routes CRUD de base

### Variables d'environnement
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tandem"
PORT=4000
```











