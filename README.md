# Product API

API REST Node.js avec Express 5, Mongoose et MongoDB. Les échanges se font en JSON.

## Installation et démarrage

```bash
npm install
```

Copiez `.env.example` vers `.env`, puis adaptez `MONGODB_URI` à votre instance MongoDB.
Configurez aussi `AUTH_USERNAME`, `AUTH_PASSWORD` et `JWT_SECRET`. Le secret JWT doit faire au moins 32 octets. Generez-en un avec :

```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
```
Le compte est unique et configure par variables d'environnement. Ne publiez jamais le fichier `.env`.
Le compte est unique et configure par variables d'environnement. Ne publiez jamais le fichier `.env`.

```bash
npm run dev
```

L'API écoute par défaut sur `http://localhost:3000`. Le contrôle de santé est disponible sur `GET /api/health`.

## Routes produits

| Méthode | Route               | Action                    | Réponse attendue             |
| ------- | ------------------- | ------------------------- | ---------------------------- |
| GET     | `/api/products`     | Lister les produits       | `200 OK`                     |
| GET     | `/api/products/:id` | Consulter un produit      | `200 OK`, ou `404 Not Found` |
| POST    | `/api/products`     | Ajouter un produit        | `201 Created`                |
| PUT     | `/api/products/:id` | Remplacer tous les champs | `200 OK`                     |
| PATCH   | `/api/products/:id` | Modifier certains champs  | `200 OK`                     |
| DELETE  | `/api/products/:id` | Supprimer un produit      | `204 No Content`             |

## Authentification

`POST /api/auth/login` prend `{ "username": "...", "password": "..." }` et retourne un jeton d'acces Bearer valable 300 secondes. Les routes de lecture restent publiques ; `POST`, `PUT`, `PATCH` et `DELETE` sur les produits exigent `Authorization: Bearer <jeton>`. Un jeton manquant, invalide ou expire retourne `401 Unauthorized` avec `WWW-Authenticate: Bearer`.

Exemple de connexion :

```json
{
  "username": "exemple",
  "password": "password"
}
```

La reponse contient `access_token`, `token_type` (`Bearer`) et `expires_in` (`300`). Les identifiants invalides retournent `401`, et les champs de connexion manquants retournent `400`.

Exemple de corps JSON :

```json
{
  "name": "Clavier mecanique",
  "description": "Clavier compact",
  "price": 89.9,
  "category": "Informatique"
}
```
