# 📝 Shopping List API

API REST simple pour gérer une liste de courses avec Node.js, Express et MongoDB.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- MongoDB
- npm

### Installation
```bash
git clone <votre-repo>
cd shopping-list-api
npm install
cp .env.example .env
npm start
```

### Variables d'environnement (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopping-list
```

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/items` | Récupérer tous les articles |
| POST | `/api/items` | Créer un article |
| PUT | `/api/items/:id` | Modifier un article |
| PATCH | `/api/items/:id/toggle` | Basculer le statut acheté |
| DELETE | `/api/items/:id` | Supprimer un article |
| GET | `/health` | Vérifier l'état du serveur |

### Exemples d'utilisation

```bash
# Récupérer les articles
curl http://localhost:3000/api/items

# Créer un article
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Pommes","quantity":5,"category":"alimentaire"}'

# Marquer comme acheté
curl -X PATCH http://localhost:3000/api/items/{id}/toggle
```

### Structure d'un article
```json
{
  "id": "string",
  "name": "string",
  "quantity": "number",
  "category": "alimentaire|hygiène|ménage|autre",
  "purchased": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## 🛠️ Développement

```bash
# Mode développement
npm run dev

# Tests
npm test

# Linting
npm run lint
```

## 🚀 Déploiement

### Avec PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Configuration Nginx
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 📁 Structure du projet

```
shopping-list-api/
├── src/
│   ├── controllers/     # Logique métier
│   ├── models/         # Modèles MongoDB
│   ├── routes/         # Routes Express
│   ├── middleware/     # Middlewares personnalisés
│   └── config/         # Configuration DB
├── logs/               # Fichiers de logs
├── server.js          # Point d'entrée
├── ecosystem.config.js # Configuration PM2
└── package.json
```

## 📊 Réponses API

### Succès
```json
{
  "success": true,
  "message": "Article créé avec succès",
  "data": { /* objet ou tableau */ }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques"
}
```

## ⚡ Rate Limiting

- **Limite générale :** 200 requêtes/minute
- **API :** 100 requêtes/minute
- **Réponse dépassement :** HTTP 429

## 🔒 Sécurité

- Headers de sécurité avec Helmet
- Rate limiting avec Nginx
- Validation des données d'entrée
- Variables d'environnement pour les secrets

## 📝 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Démarrer en production |
| `npm run dev` | Démarrer en développement |
| `npm run pm2:start` | Démarrer avec PM2 |
| `npm run pm2:logs` | Voir les logs PM2 |

## 🐛 Dépannage

### L'API ne démarre pas
```bash
# Vérifier les logs
npm start
# ou
pm2 logs shopping-list-api
```

### Problème de base de données
```bash
# Vérifier MongoDB
systemctl status mongod
# ou
brew services list | grep mongodb
```

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3000
# Changer le port
PORT=3001 npm start
```
