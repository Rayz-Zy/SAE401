#!/bin/bash

# Configuration des chemins
FRONT_DIR="$(dirname "$0")/datasense-app"
BACK_DIR="$(dirname "$0")/datasense"

echo "[INFO] Lancement des serveurs..."

# Vérification des répertoires
if [ ! -d "$FRONT_DIR" ]; then
    echo "[ERREUR] Répertoire frontal introuvable : $FRONT_DIR"
    exit 1
fi
if [ ! -d "$BACK_DIR" ]; then
    echo "[ERREUR] Répertoire backend introuvable : $BACK_DIR"
    exit 1
fi

# Fonction pour arrêter les serveurs à la fin
cleanup() {
    echo ""
    echo "[INFO] Arrêt des serveurs..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT

# Lancement du serveur frontal
echo "[ETAPE 1/2] Lancement du serveur frontal (npm run dev)..."
cd "$FRONT_DIR" && npm run dev &

# Lancement du serveur backend
echo "[ETAPE 2/2] Lancement du serveur backend (symfony serve)..."
cd "$BACK_DIR" && symfony serve &

echo "[SUCCESS] Les deux serveurs sont lancés !"
echo "[INFO] Appuyez sur Ctrl+C pour arrêter les serveurs."

# Garder le script en vie
wait
