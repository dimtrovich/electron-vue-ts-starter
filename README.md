# Electron-Vue + Typescript Starter Kit

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Kit de démarrage pour construire des applications desktop modernes avec **Electron**, **Vue 3** et **TypeScript**. Ce kit offre une plateforme robuste pour la gestion d'état de session avec support multi-plateforme, authentification intégrée et synchronisation automatique.

---

## 📋 Table des matières

- [Caractéristiques](#-caractéristiques)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Développement](#-développement)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Configuration](#-configuration)
- [Déploiement](#-déploiement)
- [Technologies utilisées](#-technologies-utilisées)

---

## ✨ Caractéristiques

### Core Features
- **🖥️ Application de Bureau Multi-Plateforme** - Windows, Linux, macOS via Electron
- **🔐 Authentification Intégrée** - Système d'authentification complet avec gestion de session
- **🌍 Internationalisation (i18n)** - Support multi-langue avec chargement dynamique
- **💾 Stockage Persistant** - Cache, paramètres et état préservés entre les sessions
- **🔄 Auto-Updater** - Mise à jour automatique intégrée

### Expérience Développeur
- **⚡ Vue 3 + TypeScript** - Framework moderne avec support complet du typage
- **🎨 Pinia State Management** - Gestion d'état réactive et performante
- **🛣️ Vue Router** - Routage côté client avancé avec middleware
- **📡 Système IPC** - Communication transparente main/renderer
- **🔧 Vite Build System** - Compilation rapide et HMR en développement
- **✅ ESLint & Prettier** - Code formaté et linting configurés

### Interface Utilisateur
- **🎭 Fenêtre sans bordure** - Design épuré avec contrôles personnalisés
- **🎨 Thème light/dark** - Support natif des thèmes système
- **📱 Dialogs natives** - Fichier, répertoire et boîtes de dialogue système
- **⚡ Composants auto-enregistrés** - Système de composants automatisé

---

## 🏗️ Architecture

### Structure Logicielle

```
src/
├── main/                    # Processus principal (Electron)
│   ├── main.js             # Point d'entrée principal
│   ├── ipc.js              # Handlers IPC (fenêtre, dialogs, etc.)
│   ├── preload.js          # Préchargement sécurisé
│   ├── updater.js          # Gestion des mises à jour
│   ├── logger.js           # Logging système
│   ├── ndialog.js          # Dialogs natifs
│   └── window-state.js     # Gestion de l'état de fenêtre
│
├── renderer/               # Processus renderer (Vue App)
│   ├── renderer.ts         # Point d'entrée renderer
│   ├── App.vue             # Composant racine
│   ├── router/             # Configuration des routes
│   │   ├── index.ts        # Router principal
│   │   └── auth.routes.ts  # Routes d'authentification
│   ├── stores/             # Pinia stores
│   │   └── auth.store.ts   # Store authentification
│   ├── middlewares/        # Route middlewares
│   │   ├── authenticate.ts
│   │   ├── auto-logout.ts
│   │   └── guest.ts
│   ├── plugins/            # Plugins Vue
│   │   ├── axios.ts        # Client HTTP
│   │   ├── i18n.ts         # Internationalization
│   │   ├── storage.ts      # Stockage local
│   │   └── vue-packages.ts # Packages Vue
│   ├── layouts/            # Composants de layout
│   ├── views/              # Pages principales
│   ├── components/         # Composants réutilisables
│   ├── utils/              # Utilitaires
│   ├── types/              # Définitions TypeScript
│   ├── enums/              # Énumérations
│   ├── locales/            # Fichiers de traduction
│   └── assets/             # Ressources statiques
│
└── shared/                 # Code partagé main/renderer
    ├── store/
    │   ├── cache.js       # Cache en mémoire
    │   ├── settings.js    # Paramètres persistants
    │   └── preset.js      # Préréglages
    └── utils/
        ├── env.js         # Variables d'environnement
        └── package.js     # Info du package
```

### Flux d'Authentification

```
User Login
   ↓
AuthStore (Pinia) ← API /api/auth/login
   ↓
axios interceptor ajoute access_token
   ↓
Protected Routes protégées par middleware
   ↓
Auto-logout après timeout (INACTIVE_SESSION_TIMEOUT)
```

---

## 📦 Prérequis

- **Node.js** >= 22.13 (vérifié avec `node --version`)
- **npm** ou **yarn** (yarn recommandé)
- **Python** (requis pour certaines dépendances natives)
- **Electron 34.5.1** (inclus dans les devDependencies)

### Outils recommandés
- [nvm](https://github.com/nvm-sh/nvm) - Gestionnaire de versions Node
- [Git](https://git-scm.com/) - Contrôle de version

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/dimtrovich/electron-vue-ts-starter.git
cd electron-vue-ts-starter
```

### 2. Installer les dépendances

```bash
# Avec yarn (recommandé)
yarn install

# Ou avec npm
npm install
```

### 3. Configuration initiale (optionnel - pour les miroirs Chine)

```bash
# NPM registry
npm config set registry https://registry.npmmirror.com

# Electron mirror
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/
```

---

## 💻 Développement

### Démarrage du serveur de développement

```bash
yarn start
```

Cela lance:
- Le processus principal Electron
- Le serveur Vite avec HMR (Hot Module Replacement)
- Devtools automatiquement accessible

### Mode développement sans packager

```bash
yarn dev
```

Lance le serveur Vite uniquement (pour debuggage renderer).

### Linting & Formatage

```bash
# Linter le code
yarn lint

# Formater avec Prettier
npx prettier --write .
```

---

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `yarn start` | Lance l'application en mode développement |
| `yarn dev` | Serveur Vite uniquement |
| `yarn package` | Empaquète l'application (producton) |
| `yarn make` | Crée les installateurs (`.exe`, `.zip`, `.AppImage`) |
| `yarn publish` | Publie les mises à jour (si configuré) |
| `yarn push-win` | Publie sur serveur de mises à jour (Windows) |
| `yarn lint` | Exécute le linting ESLint |

---

## 🔧 Configuration

### Variables d'environnement (`.env`)

Créez un fichier `.env` à la racine:

```env
# API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=SSM v3

# Session
VITE_INACTIVE_SESSION_TIMEOUT=1800000  # 30 minutes en ms

# Electron
VITE_ELECTRON_DEV=true
```

### Configuration Electron (`forge.config.js`)

- **Icône**: Placez vos icônes dans `src/main.ico` et `src/setup.ico`
- **Signature**: Configurez les certificats pour la signature de l'app
- **Updates URL**: `urls.update` dans `package.json`

### Configuration Vite

Les configurations sont dans `vite.*.config.mjs`:
- `vite.base.config.mjs` - Config commune
- `vite.main.config.mjs` - Process principal
- `vite.renderer.config.mjs` - Process renderer
- `vite.preload.config.mjs` - Script de préchargement

---

## 📱 Structure détaillée

### Middlewares de Route

- **`authenticate.ts`** - Protège les routes authentifiées
- **`auto-logout.ts`** - Déconnexion automatique après inactivité
- **`guest.ts`** - Redirige les utilisateurs authentifiés

### Stores Pinia

**Auth Store** (`stores/auth.store.ts`):
- `accessToken` - Token d'authentification
- `user` - Données utilisateur actuelles
- `lastConnected` - Dernier utilisateur connecté
- Actions: `login()`, `logout()`, `checkAuth()`

### IPC Handlers

**Opérations fenêtre**:
- `minimize` - Minimiser la fenêtre
- `maximizeOrRestore` - Maximiser/Restaurer
- `close` - Fermer l'application

**Dialogs**:
- `openDialog` - Sélection fichier/dossier
- `saveDialog` - Sauvegarde fichier

---

## 🏭 Déploiement

### Build Production

```bash
# Package pour production
yarn package

# Génère les installateurs
yarn make
```

Outputs dans `out/make/`:
- **Windows**: `.exe` (Squirrel), `.zip`
- **Linux**: `.AppImage`, `.deb`
- **macOS**: `.zip`, `.dmg`

### Mise à jour

1. Configurez l'URL de mise à jour dans `package.json`:
   ```json
   "urls": {
     "update": "https://votre-serveur.com/api/v1/updates/AppName"
   }
   ```

2. L'auto-updater vérifie périodiquement les nouvelles versions

3. Publiez les releases:
   ```bash
   yarn make
   yarn publish
   ```

---

## 🔐 Sécurité

### Recommandations

- ✅ Preload script sécurisé (`src/main/preload.js`)
- ✅ IPC handlers validés
- ✅ Context isolation activé
- ⚠️ Désactiver Node.js integration par défaut
- ⚠️ Valider toutes les données IPC côté main

### À faire avant production

1. Remplacer les icônes (`src/main.ico`, `setup.ico`)
2. Signer l'application (certificat Windows)
3. Configurer HTTPS pour l'API
4. Implémenter le stockage sécurisé des tokens
5. Auditer les permissions IPC

---

## 📚 Technologies utilisées

### Frontend
| Tech | Version | Usage |
|------|---------|-------|
| Vue | 3.5.35 | Framework principal |
| Vue Router | 4.5.0 | Routage |
| Pinia | 3.0.4 | State management |
| TypeScript | Latest | Typage statique |
| Vite | 8.0.16 | Build tool |
| Bootstrap Vue Next | 0.45.4 | UI Components |
| Axios | 1.17.0 | HTTP Client |
| Vue i18n | 11.1.2 | Internationalization |

### Backend
| Tech | Version | Usage |
|------|---------|-------|
| Electron | 34.5.1 | Desktop framework |
| Electron Forge | 7.7.0 | Packaging |
| electron-store | 10.0.1 | Persistent storage |
| electron-log | 5.3.4 | Logging |

### Dev Tools
| Tech | Version | Usage |
|------|---------|-------|
| ESLint | 10.4.1 | Linting |
| Prettier | 3.8.3 | Code formatting |
| Vite Plugin Vue Devtools | 7.7.2 | Vue DevTools |

---

## 🐛 Troubleshooting

### L'application ne démarre pas
```bash
# Nettoyer cache et rebuild
rm -rf node_modules .vite out
yarn install
yarn start
```

### Problème de dépendances natives
```bash
# Rebuild dépendances natives
npm rebuild
```

### Port 5173 déjà en utilisation
Vite essaiera automatiquement le prochain port disponible.

### Erreurs IPC
Vérifiez que les handlers IPC sont enregistrés dans `src/main/ipc.js` avant la création de la fenêtre.

---

## Credit
https://github.com/ZeroKwok/ElectronVueTemplate

## 📝 License

MIT © 2026 dimtrovich - [LICENSE](LICENSE)

---

## 🤝 Support & Contact

- **Email**: devcode.dst@gmail.com
- **Author**: zero

Pour des questions ou des rapports de bugs, veuillez ouvrir une issue sur le dépôt.

---

**Version**: 1.0.0-beta.1 | **Last Updated**: Juin 2026

## 🤝 Contributing

Suggestions and code contributions are welcome! Please make sure to read the [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).
