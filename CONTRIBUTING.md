# 🤝 Guide de Contribution - Tandem

Merci de votre intérêt pour contribuer au projet Tandem ! Ce guide vous aidera à comprendre comment contribuer efficacement.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Processus de Développement](#processus-de-développement)
- [Standards de Code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Questions](#questions)

## 🎯 Code de Conduite

Ce projet suit un code de conduite simple :

- **Respectez** tous les contributeurs
- **Soyez constructif** dans vos commentaires
- **Restez ouvert** aux nouvelles idées
- **Collaborez** de manière positive

## 🚀 Comment Contribuer

### 1. Signaler un Bug

Si vous trouvez un bug :

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Comportement attendu vs réel
   - Captures d'écran si applicable
   - Informations sur votre environnement

### 2. Proposer une Fonctionnalité

Pour proposer une nouvelle fonctionnalité :

1. Créez une issue avec le template "Feature Request"
2. Décrivez clairement la fonctionnalité
3. Expliquez pourquoi elle serait utile
4. Proposez une implémentation si possible

### 3. Contribuer au Code

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Créez** une branche feature : `git checkout -b feature/nom-de-la-fonctionnalite`
4. **Développez** votre fonctionnalité
5. **Testez** vos changements
6. **Commit** avec des messages clairs
7. **Push** vers votre fork
8. **Ouvrez** une Pull Request

## 🔄 Processus de Développement

### Branches

- `main` : Branche de production
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes

### Convention de Noms

```bash
feature/ajout-gestion-stock
bugfix/correction-calcul-inventaire
hotfix/fix-securite-authentification
```

### Messages de Commit

Utilisez le format conventionnel :

```
type(scope): description

type: feat, fix, docs, style, refactor, test, chore
scope: backend, frontend, api, ui, etc.
```

Exemples :
```
feat(backend): ajout endpoint création produit
fix(frontend): correction affichage stock négatif
docs(readme): mise à jour instructions installation
```

## 📏 Standards de Code

### TypeScript

- Utilisez le strict mode
- Évitez `any`, préférez des types explicites
- Documentez les interfaces complexes

### React/Next.js

- Utilisez les hooks de manière optimale
- Préférez les composants fonctionnels
- Implémentez la gestion d'erreur

### CSS

- Utilisez Tailwind CSS
- Suivez la convention BEM pour les classes custom
- Optimisez pour mobile-first

### Backend

- Validez toutes les entrées
- Gérez les erreurs proprement
- Utilisez des middlewares appropriés

## 🧪 Tests

### Frontend

```bash
cd apps/web
npm test
npm run test:coverage
```

### Backend

```bash
cd apps/backend
npm test
npm run test:integration
```

### Règles de Tests

- Couvrez au moins 80% des nouvelles fonctionnalités
- Testez les cas d'erreur
- Utilisez des données mock appropriées

## 📚 Documentation

### Code

- Documentez les fonctions complexes
- Ajoutez des JSDoc pour les APIs
- Expliquez les décisions architecturales

### README

- Mettez à jour le README si nécessaire
- Documentez les nouvelles dépendances
- Ajoutez des exemples d'utilisation

### API

- Documentez les nouveaux endpoints
- Incluez des exemples de requêtes/réponses
- Spécifiez les codes d'erreur

## 🔍 Review Process

### Pull Request

1. **Titre clair** : Décrivez ce que fait la PR
2. **Description détaillée** : Expliquez les changements
3. **Tests** : Vérifiez que tous les tests passent
4. **Documentation** : Mettez à jour si nécessaire

### Checklist

- [ ] Code fonctionnel et testé
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de console.log oubliés
- [ ] Respect des standards de code
- [ ] Commit messages clairs

### Review Guidelines

- **Soyez constructif** dans vos commentaires
- **Expliquez** pourquoi vous suggérez des changements
- **Reconnaissez** les bonnes pratiques
- **Testez** les changements localement si nécessaire

## 🐛 Débogage

### Outils Recommandés

- **VS Code** avec extensions TypeScript
- **React Developer Tools**
- **Prisma Studio** pour la DB
- **Postman** pour tester l'API

### Logs

- Utilisez des logs structurés
- Évitez les logs en production
- Incluez des IDs de trace

## 💡 Idées de Contribution

### Pour Débutants

- [ ] Correction de typos dans la documentation
- [ ] Amélioration des messages d'erreur
- [ ] Ajout d'exemples dans le README
- [ ] Tests unitaires pour composants existants

### Pour Avancés

- [ ] Nouvelles fonctionnalités métier
- [ ] Optimisations de performance
- [ ] Intégrations tierces
- [ ] Refactoring de code legacy

## ❓ Questions

- **Discussions** : Utilisez les [Discussions](../../discussions) GitHub
- **Issues** : Pour les bugs et fonctionnalités
- **Email** : [votre-email@example.com]

## 🎉 Reconnaissance

Tous les contributeurs sont listés dans le fichier [CONTRIBUTORS.md](CONTRIBUTORS.md).

---

Merci de contribuer à Tandem ! 🚀
