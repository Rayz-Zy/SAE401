# SAE401 - DataSense

Projet de visualisation de données statistiques sur le logement et la démographie en France.

### 1. Frontend (`datasense-app`)
Ouvrez un terminal dans le dossier `datasense-app` et installez les dépendances :
```bash
cd datasense-app
npm install
```

### 2. Backend (`datasense`)
Ouvrez un terminal dans le dossier `datasense` et installez les dépendances PHP :
```bash
cd datasense
composer install
```
*Note : Assurez-vous d'avoir PHP 8.2+ et Composer installés.*

### 3. Base de données
pour importer la base de données, importez le fichier:
- Fichier : `datasense.sql`

## Lancement du projet

deux méthodes de lancement:

### Option A : Script automatique (Recommandé)
**Sur Windows :**
Double-cliquez sur 👉 `lancer_serveurs.bat`

**Sur Linux / macOS :**
Exécutez le script shell :
```bash
chmod +x lancer_serveurs.sh
./lancer_serveurs.sh
```

Ce script lancera automatiquement le frontend (Vite) et le backend (Symfony CLI) dans deux processus distincts.

### Option B : Lancement manuel
**Démarrer le Frontend :**
```bash
cd datasense-app
npm run dev
```

**Démarrer le Backend :**
```bash
cd datasense
symfony serve
```

## Mode API (Local vs En ligne)
Dans l'application, vous pouvez basculer entre l'API locale et l'API distante via le bouton dans le Header :
- **API en ligne** : Utilise les données hébergées sur AlwaysData (lecture seule).
- **API Locale** : Utilise votre serveur local `http://127.0.0.1:8000`. Utile pour le développement backend.

---
*Projet réalisé dans le cadre de la SAE 4.01.*
