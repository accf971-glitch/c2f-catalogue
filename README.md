# Catalogue de Formations - C2F

Application inspirée de https://catalogueformations-c2f.catalogueformpro.com/ : catalogue de
formations avec catégories, filtres, recherche, fiches détaillées et formulaire de demande
d'information.

## Stack

- **Frontend** : HTML / CSS / JavaScript "vanilla" (aucun framework, aucune étape de build)
- **Backend** : Node.js + Express
- **Base de données** : SQLite via le module natif `node:sqlite` (intégré à Node.js, aucune
  compilation native requise), fichier stocké dans `server/data/catalogue.db`

## Structure

```
c2f-catalogue/
  server/
    server.js      # serveur Express + routes API
    db.js           # connexion SQLite + schéma des tables
    seed.js         # jeu de données initial (catégories + formations)
    mailer.js        # envoi d'email (notification + confirmation) via Gmail
    .env              # identifiants email (non versionné, voir .gitignore)
    package.json
    data/            # fichier catalogue.db généré au démarrage
  public/
    index.html       # page catalogue (filtres, recherche, grille)
    formation.html    # fiche détaillée d'une formation
    css/style.css
    js/main.js         # logique catalogue
    js/formation.js    # logique fiche détaillée + formulaire de contact
```

## Installation et démarrage

Prérequis : [Node.js](https://nodejs.org/) version 22.5 ou plus récente (testé avec la v24 LTS),
car le module `node:sqlite` est utilisé.

```bash
cd server
npm install
npm run seed     # crée la base et insère les formations de démonstration
npm start
```

Le site est alors disponible sur **http://localhost:3000**.

## Ajouter / modifier des formations

Le plus simple pour l'instant est d'éditer le tableau `formations` dans `server/seed.js` puis de
relancer `npm run seed` (les formations déjà présentes en base, identifiées par leur `slug`, ne
sont pas dupliquées). Une interface d'administration pourra être ajoutée dans une prochaine
version pour éviter d'éditer le code directement.

## API

| Méthode | Route                  | Description                                              |
|---------|-------------------------|------------------------------------------------------------|
| GET     | `/api/categories`       | Liste des catégories                                       |
| GET     | `/api/formations`       | Liste des formations, filtrable via query params : `category`, `format`, `certifiante` (0/1), `cpf` (0/1), `lieu`, `q` (recherche texte) |
| GET     | `/api/formations/:id`   | Détail d'une formation (par id ou par slug)                |
| POST    | `/api/contact`          | Enregistre une demande d'information (`formation_id`, `nom`, `email`, `telephone`, `message`) et déclenche l'envoi d'email |

## Configuration email

Le fichier `server/.env` contient les identifiants utilisés pour l'envoi automatique d'email à
chaque demande de contact (via le compte Gmail `c2f.antilles@gmail.com` et un mot de passe
d'application) :

```
GMAIL_USER=c2f.antilles@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
CONTACT_NOTIFY_EMAIL=carinefontenelle@c2f-antilles.com
```

Deux emails sont envoyés à chaque demande : une notification à `CONTACT_NOTIFY_EMAIL` avec les
détails du contact, et une confirmation automatique au visiteur. Si `GMAIL_APP_PASSWORD` change
ou expire, régénérez-en un nouveau sur
[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) et remplacez la
valeur dans `.env` (puis redémarrez le serveur). Ce fichier ne doit jamais être partagé ni commité
dans un dépôt Git (il est listé dans `.gitignore`).

## Déploiement (Render, gratuit)

Le fichier `render.yaml` à la racine configure automatiquement le déploiement sur
[Render](https://render.com) (offre gratuite, sans carte bancaire requise). Le site sera
accessible sur une adresse du type `https://c2f-catalogue.onrender.com`.

**Étapes** (à faire une seule fois) :

1. Mettre le code sur GitHub (créer un compte GitHub si besoin, puis un nouveau dépôt et y
   pousser le contenu de ce dossier).
2. Créer un compte sur [render.com](https://render.com) (gratuit, connexion possible avec
   GitHub).
3. Dans le tableau de bord Render : **New > Blueprint**, sélectionner le dépôt GitHub — Render
   détecte automatiquement `render.yaml` et propose le service `c2f-catalogue`.
4. Avant de valider, renseigner les 3 variables d'environnement demandées (`GMAIL_USER`,
   `GMAIL_APP_PASSWORD`, `CONTACT_NOTIFY_EMAIL`) avec les valeurs du fichier `server/.env` local.
5. Cliquer sur **Apply** / **Deploy** — le premier déploiement prend quelques minutes.

**Limite de l'offre gratuite Render à connaître** : l'instance se met en veille après 15 minutes
sans visite (le premier chargement après une veille prend ~30-50 secondes), et le disque n'est
pas garanti persistant d'un déploiement à l'autre — en cas de nouveau déploiement, la base de
données peut repartir du jeu de données initial (`npm run seed`). Ce n'est pas bloquant : chaque
demande de contact est de toute façon envoyée par email en plus d'être stockée en base.

## Prochaines étapes possibles

- Interface d'administration pour gérer les formations sans toucher au code
- Vrai logo C2F (les couleurs officielles sont déjà intégrées)
- Nom de domaine personnalisé (Render permet d'en brancher un gratuitement par-dessus le
  sous-domaine `.onrender.com`)
