# Product API

API REST Node.js avec Express 5, Mongoose et MongoDB. Les échanges se font en JSON.

## Installation et démarrage

```bash
npm install
```

Copiez `.env.example` vers `.env`, puis adaptez `MONGODB_URI` à votre instance MongoDB.

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

Exemple de corps JSON :

```json
{
  "name": "Clavier mecanique",
  "description": "Clavier compact",
  "price": 89.9,
  "category": "Informatique"
}
```
