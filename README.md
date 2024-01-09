# JustChat

JustChat est une application de messagerie instantanée qui vous permet de communiquer avec de nombreuses personnes en temps réel. Il offre une expérience de chat fluide et conviviale pour vous connecter et interagir avec vos amis, votre famille et vos collègues.

![Home page of JustChat](https://res.cloudinary.com/e-tech-test/image/upload/v1704836134/ogmuidb6v7ltw3vejwak.png)

## Technologies utilisées
### Front-End
- React
- Typescript
- React-Query
- Redux
- Vitest

### Back-End
- Node.js
- Express
- Websocket
- MongoDB
- Jest

## Installation
Pour exécuter localement votre propre instance de JustChat, suivez ces étapes :

1. Clonez ce dépôt sur votre machine :
`git clone https://github.com/R0BIN0/JustChat.git`

2. Accédez au répertoire du projet :
`cd justChat`

3. Installez les dépendances du Client:
`cd client`
`npm install`

4. Installez les dépendances du Serveur :
`cd server`
`npm install`

5. Configurer le .env :
`créer un fichier ".env" à la racine du dossier "server"` et insérer dedans :

| Clé | Valeur |
| ----------- | ----------- |
| LOCAL_DB_URL | <YOUR_MONGO_DB_URL> |
| JWT_EXPIRE | "24h" |
| JWT_SECRET | <YOUR_JWT_SECRET> |

6. Lancer le Client :
`cd client`
`npm run dev`

7. Lancer le Serveur :
`cd server`
`npm run server`

8. Accédez à l'application dans votre navigateur à l'adresse : http://localhost:3000

## Fonctionnalités clés
- Chat en temps réel avec d'autres utilisateurs.
- Gestion des utilisateurs avec des comptes utilisateur et des profils.
- Historique des messages pour un suivi facile des conversations passées.
- Intégration de réactions emoji pour des interactions amusantes.
  
![Home page of JustChat](https://res.cloudinary.com/e-tech-test/image/upload/v1704837442/e5sokbt5vapgsjpzna2f.png)

Profitez de JustChat pour communiquer avec vos amis, collègues et proches de manière instantanée !









