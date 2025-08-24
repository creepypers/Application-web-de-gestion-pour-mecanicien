# 🚗 AutoConnect - Plateforme de Gestion Automobile

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.6-purple.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-green.svg)](https://getbootstrap.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.2.7-red.svg)](https://redux-toolkit.js.org/)

## 📋 Description

AutoConnect est une application web moderne et intuitive conçue pour simplifier la gestion des rendez-vous automobiles. Cette plateforme tout-en-un permet aux clients de prendre des rendez-vous d'entretien et aux mécaniciens de gérer leur planning et leurs services.

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Gestion des Utilisateurs
- **Inscription/Connexion** sécurisée pour clients et mécaniciens
- **Profils personnalisés** avec gestion des informations
- **Système de rôles** (client/mécanicien) avec autorisations appropriées

### 📅 Gestion des Rendez-vous
- **Prise de rendez-vous** en ligne avec sélection de date et heure
- **Modification et annulation** des rendez-vous existants
- **Historique complet** des services effectués
- **Notifications** et rappels automatiques

### 🚙 Gestion des Véhicules
- **Enregistrement des véhicules** avec informations détaillées
- **Suivi de l'entretien** et des réparations
- **Historique des services** par véhicule

### 💰 Gestion Financière
- **Facturation automatique** des services
- **Méthodes de paiement** sécurisées
- **Suivi des paiements** et historique des transactions
- **Gestion des factures** et reçus

### 🛠️ Tableau de Bord Mécanicien
- **Planning des rendez-vous** avec vue d'ensemble
- **Gestion des services** en cours
- **Suivi des gains** et statistiques
- **Gestion des clients** et véhicules

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.2.0** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite 5.2.6** - Outil de build rapide et moderne
- **Bootstrap 5.3.3** - Framework CSS pour un design responsive
- **React Bootstrap 2.10.5** - Composants React basés sur Bootstrap

### État et Gestion des Données
- **Redux Toolkit 2.2.7** - Gestion d'état prédictible
- **React Redux 9.1.2** - Intégration React-Redux

### Interface Utilisateur
- **Material-UI 6.1.3** - Composants UI modernes et accessibles
- **FontAwesome 6.6.0** - Icônes vectorielles
- **Emotion 11.13.3** - CSS-in-JS pour la personnalisation

### Navigation et Routage
- **React Router DOM 6.26.2** - Routage côté client

### Utilitaires
- **Axios 1.7.7** - Client HTTP pour les requêtes API
- **Date-fns 4.1.0** - Manipulation des dates
- **Material-UI Date Pickers 7.19.0** - Sélecteurs de date avancés

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone [URL_DU_REPO]
   cd tp1inforoute-Final
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer l'application en mode développement**
   ```bash
   npm start
   ```

4. **Ouvrir votre navigateur**
   - L'application sera accessible à l'adresse : `http://localhost:5173`

### Scripts disponibles

```bash
# Démarrer le serveur de développement
npm start

# Construire l'application pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## 📁 Structure du Projet

```
tp1inforoute-Final/
├── public/                 # Fichiers publics statiques
├── src/                    # Code source de l'application
│   ├── components/         # Composants React réutilisables
│   │   ├── AppointmentList.jsx      # Liste des rendez-vous
│   │   ├── BookAppointment.jsx      # Prise de rendez-vous
│   │   ├── ClientDashboard.jsx      # Tableau de bord client
│   │   ├── MechanicDashboard.jsx    # Tableau de bord mécanicien
│   │   ├── Login.jsx                # Connexion
│   │   ├── Signup.jsx               # Inscription
│   │   ├── Profile.jsx              # Gestion du profil
│   │   ├── VehicleManagement.jsx    # Gestion des véhicules
│   │   ├── Payments.jsx             # Gestion des paiements
│   │   ├── Invoices.jsx             # Gestion des factures
│   │   └── ...                      # Autres composants
│   ├── store/              # Configuration Redux
│   │   ├── slices/         # Slices Redux Toolkit
│   │   │   ├── authSlice.js         # Authentification
│   │   │   ├── appointmentsSlice.js # Rendez-vous
│   │   │   ├── vehiclesSlice.js     # Véhicules
│   │   │   ├── paymentsSlice.js     # Paiements
│   │   │   └── ...                  # Autres slices
│   │   └── store.js        # Configuration du store
│   ├── styles/             # Fichiers de style
│   │   └── custom.css      # Styles personnalisés
│   ├── App.jsx             # Composant principal
│   └── index.jsx           # Point d'entrée
├── package.json            # Dépendances et scripts
└── README.md               # Documentation du projet
```

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# Configuration de l'API
REACT_APP_API_URL=http://localhost:3000/api

# Configuration de l'authentification
REACT_APP_JWT_SECRET=your_jwt_secret_here
```

## 📱 Fonctionnalités par Rôle

### 👤 Client
- ✅ Prise de rendez-vous en ligne
- ✅ Gestion du profil personnel
- ✅ Suivi des véhicules et de l'entretien
- ✅ Consultation de l'historique des services
- ✅ Gestion des méthodes de paiement
- ✅ Consultation des factures et reçus

### 🔧 Mécanicien
- ✅ Tableau de bord avec planning des rendez-vous
- ✅ Gestion des services et réparations
- ✅ Suivi des gains et statistiques
- ✅ Gestion des clients et véhicules
- ✅ Consultation de l'historique des interventions

## 🎨 Design et Interface

L'application utilise une palette de couleurs moderne et professionnelle :
- **Couleur principale** : `#181C14` (Vert foncé)
- **Couleur secondaire** : `#697565` (Vert moyen)
- **Couleur d'accent** : `#ECDFCC` (Beige clair)
- **Couleur de texte** : `#3C3D37` (Gris foncé)

L'interface est entièrement responsive et s'adapte à tous les appareils (ordinateurs, tablettes, smartphones).

## 🔒 Sécurité

- **Authentification JWT** pour la sécurisation des sessions
- **Routes protégées** avec vérification des rôles
- **Validation des données** côté client et serveur
- **Gestion sécurisée** des informations sensibles

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Déploiement sur serveur web
Les fichiers générés dans le dossier `dist/` peuvent être déployés sur n'importe quel serveur web statique (Apache, Nginx, etc.).

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request




---

**AutoConnect** - Simplifiez la gestion de votre véhicule ! 🚗✨
