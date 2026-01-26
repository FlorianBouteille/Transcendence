# Roadmap - Transformation en Jeu Multijoueur

## Vue d'ensemble
Transformation du jeu local en application web multijoueur avec architecture client-serveur, communication temps réel, et déploiement via Docker.

---

## Phase 1 : Architecture Docker & Infrastructure de Base

### 1.1 Restructuration du projet
- [ ] Créer une structure claire séparant client/serveur
  ```
  /backend        → Serveur Node.js (logique de jeu)
  /frontend       → Client web (rendu)
  /shared         → Code partagé (constantes, types, utils)
  /nginx          → Reverse proxy
  /docker         → Configurations Docker
  ```

### 1.2 Configuration Docker
- [ ] Créer/mettre à jour `docker-compose.yml` avec les services :
  - **nginx** : Reverse proxy et serveur de fichiers statiques
  - **backend** : Serveur Node.js avec Socket.IO
  - **frontend** : Build Vite et serveur de développement
  
- [ ] Configurer les Dockerfiles pour chaque service
  - `backend/Dockerfile` : Node.js + dépendances
  - `frontend/Dockerfile` : Node.js + Vite
  - `nginx/Dockerfile` : Nginx avec config custom

- [ ] Configuration réseau Docker
  - Réseau interne pour communication backend-nginx
  - Exposition des ports appropriés (80, 443, etc.)
  - Variables d'environnement pour configuration

### 1.3 Communication WebSocket
- [ ] Installer et configurer Socket.IO côté serveur
- [ ] Installer et configurer Socket.IO côté client
- [ ] Tester la connexion bidirectionnelle de base

---

## Phase 2 : Séparation Logique Serveur / Client

### 2.1 Analyse du code existant
- [ ] Identifier la logique métier à déplacer côté serveur :
  - Gestion des positions des joueurs
  - Détection des collisions
  - Gestion des checkpoints
  - Gestion des pièces (coins)
  - Logique des plateformes mobiles
  - Gestion du timer/chronomètre

- [ ] Identifier ce qui reste côté client :
  - Rendu graphique (Three.js)
  - Input utilisateur (clavier)
  - Interpolation des positions
  - Effets visuels et animations
  - UI/HUD

### 2.2 Création du Game Server (Authoritative Server)
- [ ] Créer la structure du serveur de jeu
  ```
  /backend/src/
    ├── server.js           → Entry point
    ├── gameServer.js       → Logique principale du jeu
    ├── gameState.js        → État global du jeu
    ├── player.js           → Logique joueur serveur
    ├── physics.js          → Calculs physiques
    ├── collisions.js       → Détection collisions
    ├── world.js            → Gestion du monde/niveau
    └── networkManager.js   → Gestion des messages réseau
  ```

- [ ] Implémenter la boucle de jeu serveur (game loop)
  - Tick rate fixe (ex: 60 TPS - ticks per second)
  - Mise à jour de la physique
  - Validation des inputs clients
  - Broadcast de l'état aux clients

### 2.3 Refactoring du Client
- [ ] Créer la structure client
  ```
  /frontend/src/
    ├── main.js             → Entry point
    ├── game/
    │   ├── renderer.js     → Gestion Three.js
    │   ├── inputManager.js → Capture inputs
    │   ├── networkClient.js→ Communication serveur
    │   └── interpolation.js→ Smooth movement
    ├── ui/
    │   └── hud.js          → Interface utilisateur
    └── shared/             → Types et constantes
  ```

- [ ] Implémenter le client "thin" (rendu uniquement)
  - Envoi des inputs au serveur
  - Réception de l'état du jeu
  - Rendu basé sur l'état serveur
  - Prédiction côté client (client-side prediction)
  - Réconciliation avec le serveur

---

## Phase 3 : Protocole de Communication

### 3.1 Définition des messages réseau
- [ ] Messages Client → Serveur :
  ```javascript
  - 'player:join'        → Connexion d'un joueur
  - 'player:input'       → Input utilisateur (touches pressées)
  - 'player:ready'       → Joueur prêt à commencer
  - 'ping'               → Mesure latence
  ```

- [ ] Messages Serveur → Client :
  ```javascript
  - 'game:state'         → État complet du jeu
  - 'game:update'        → Mise à jour incrémentale
  - 'player:joined'      → Nouveau joueur connecté
  - 'player:left'        → Joueur déconnecté
  - 'game:start'         → Début de partie
  - 'game:end'           → Fin de partie
  - 'pong'               → Réponse ping
  ```

### 3.2 Format des données
- [ ] Définir les structures de données partagées
  ```javascript
  PlayerState: { id, position, velocity, rotation, checkpoint, ... }
  GameState: { players, platforms, coins, timer, ... }
  Input: { keys, timestamp, sequenceNumber }
  ```

- [ ] Optimisation de la bande passante
  - Compression des données
  - Delta compression (envoyer uniquement les changements)
  - Update rate adaptatif

---

## Phase 4 : Fonctionnalités Multijoueur Core

### 4.1 Gestion des joueurs
- [ ] Connexion/déconnexion des joueurs
- [ ] Attribution d'ID uniques
- [ ] Spawn des joueurs à des positions définies
- [ ] Synchronisation des positions entre tous les clients
- [ ] Gestion de la reconnexion

### 4.2 Synchronisation du monde
- [ ] Synchronisation des plateformes mobiles
- [ ] Synchronisation des pièces collectées
- [ ] Synchronisation des checkpoints
- [ ] État global du niveau

### 4.3 Gestion du temps
- [ ] Chronomètre synchronisé serveur
- [ ] Début de partie synchronisé
- [ ] Fin de partie (premier arrivé ou timeout)

### 4.4 Gestion des collisions multijoueur
- [ ] Collision entre joueurs (optionnel)
- [ ] Vérification côté serveur uniquement
- [ ] Résolution des conflits

---

## Phase 5 : Optimisations Réseau

### 5.1 Client-Side Prediction
- [ ] Le client prédit immédiatement le mouvement
- [ ] Le serveur valide et corrige si nécessaire
- [ ] Réconciliation smooth des corrections

### 5.2 Server Reconciliation
- [ ] Historique des inputs côté client
- [ ] Numéros de séquence pour les inputs
- [ ] Rejeu des inputs après correction serveur

### 5.3 Interpolation
- [ ] Interpolation des positions des autres joueurs
- [ ] Buffer de snapshots serveur
- [ ] Smooth movement malgré le lag

### 5.4 Lag Compensation
- [ ] Mesure de la latence (ping)
- [ ] Affichage du ping dans l'UI
- [ ] Adaptation du gameplay si nécessaire

---

## Phase 6 : UI et Expérience Utilisateur

### 6.1 Lobby / Menu
- [ ] Écran de connexion
- [ ] Saisie du pseudo
- [ ] Salle d'attente
- [ ] Liste des joueurs connectés
- [ ] Bouton "Prêt" / "Start"

### 6.2 HUD en jeu
- [ ] Liste des joueurs et leur progression
- [ ] Timer synchronisé
- [ ] Indicateur de ping
- [ ] Positions relatives des joueurs
- [ ] Classement en temps réel

### 6.3 Écran de fin
- [ ] Classement final
- [ ] Temps de chaque joueur
- [ ] Bouton rejouer
- [ ] Statistiques de la partie

---

## Phase 7 : Tests et Débogage

### 7.1 Tests locaux
- [ ] Test avec 2 clients en local
- [ ] Test avec 4+ clients en local
- [ ] Test de déconnexion/reconnexion
- [ ] Test de latence simulée

### 7.2 Outils de débogage
- [ ] Logs serveur détaillés
- [ ] Panneau de debug client (positions, états)
- [ ] Visualisation de la latence
- [ ] Replay de parties (optionnel)

### 7.3 Performance
- [ ] Monitoring CPU/RAM serveur
- [ ] Profiling du game loop
- [ ] Optimisation de la bande passante
- [ ] Test de charge (nombre max de joueurs)

---

## Phase 8 : Préparation pour la Base de Données (Futur)

### 8.1 Identification des besoins
- [ ] Lister les données à persister :
  - Comptes utilisateurs
  - Historique des parties
  - Meilleurs temps
  - Statistiques joueurs
  - Classements globaux

### 8.2 Design préliminaire
- [ ] Schéma de base de données
- [ ] Choix de la BDD (PostgreSQL, MongoDB, etc.)
- [ ] Service d'authentification

### 8.3 Préparation Docker
- [ ] Ajouter service database dans docker-compose
- [ ] Volumes pour persistance des données
- [ ] Scripts d'initialisation

---

## Checklist de Démarrage Immédiat

### Étape 1 : Setup Docker (1-2 jours)
1. Mettre à jour `docker-compose.yml` avec services de base
2. Créer/mettre à jour les Dockerfiles
3. Tester le démarrage de tous les containers
4. Vérifier la communication entre services

### Étape 2 : WebSocket de Base (1 jour)
1. Installer Socket.IO sur backend et frontend
2. Établir une connexion simple
3. Tester l'envoi/réception de messages basiques

### Étape 3 : Séparation Client/Serveur (2-3 jours)
1. Créer `gameServer.js` avec logique de base
2. Déplacer la physique côté serveur
3. Créer un client minimal qui affiche l'état serveur

### Étape 4 : Premier Test Multijoueur (2-3 jours)
1. Permettre à 2 joueurs de se connecter
2. Synchroniser leurs positions
3. Afficher les deux joueurs sur chaque client

---

## Technologies Recommandées

### Backend
- **Node.js** : Environnement d'exécution
- **Express** : Framework web
- **Socket.IO** : Communication temps réel
- **PM2** : Process manager (production)

### Frontend
- **Vite** : Build tool et dev server
- **Three.js** : Rendu 3D (déjà utilisé)
- **Socket.IO Client** : Communication serveur

### Infrastructure
- **Docker & Docker Compose** : Containerisation
- **Nginx** : Reverse proxy et static files
- **PostgreSQL** : Base de données (phase ultérieure)

### DevOps (futur)
- **GitHub Actions** : CI/CD
- **Docker Hub** : Registry d'images
- **Let's Encrypt** : Certificats SSL

---

## Ressources Utiles

### Documentation
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Game Networking Patterns](https://gafferongames.com/)
- [Fast-Paced Multiplayer](https://www.gabrielgambetta.com/client-server-game-architecture.html)

### Concepts Clés
- **Authoritative Server** : Le serveur a l'autorité finale sur l'état
- **Client-Side Prediction** : Réactivité immédiate
- **Server Reconciliation** : Correction des prédictions
- **Entity Interpolation** : Mouvement fluide des autres joueurs
- **Lag Compensation** : Gestion de la latence

---

## Notes Importantes

⚠️ **Ordre de priorité** : Ne pas optimiser prématurément. Commencer simple :
1. Faire fonctionner le réseau de base
2. Synchroniser les joueurs
3. Puis optimiser (prédiction, interpolation, etc.)

⚠️ **Sécurité** : Le serveur doit TOUJOURS valider les inputs clients (anti-triche)

⚠️ **Performance** : Cibler 60 FPS côté client, 60 TPS côté serveur

⚠️ **Scalabilité** : Pour l'instant, un seul serveur de jeu suffit. La scalabilité horizontale viendra plus tard.

---

## Timeline Estimée

- **Phase 1-3** : 1-2 semaines (infrastructure + communication)
- **Phase 4** : 1 semaine (features multijoueur core)
- **Phase 5** : 1-2 semaines (optimisations réseau)
- **Phase 6** : 3-5 jours (UI/UX)
- **Phase 7** : 3-5 jours (tests)

**Total estimé** : 4-6 semaines pour un prototype multijoueur fonctionnel

---

*Document créé le 26 janvier 2026*
