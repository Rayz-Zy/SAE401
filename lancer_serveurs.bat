@echo off
setlocal enabledelayedexpansion

:: Chemins (relatifs au script)
set FRONT_DIR=%~dp0datasense-app
set BACK_DIR=%~dp0datasense

echo [INFO] Lancement des serveurs...

:: Vérifie que les répertoires existent
if not exist "%FRONT_DIR%" (
    echo [ERREUR] Répertoire frontal introuvable : %FRONT_DIR%
    pause
    exit /b 1
)
if not exist "%BACK_DIR%" (
    echo [ERREUR] Répertoire backend introuvable : %BACK_DIR%
    pause
    exit /b 1
)

:: Vérifie que les commandes existent
pushd "%FRONT_DIR%"
npm run | find "dev" >nul
if %errorlevel% neq 0 (
    echo [ERREUR] Le script 'dev' n'existe pas dans package.json.
    popd
    pause
    exit /b 1
)
popd

:: Lancement du serveur frontal
echo [ETAPE 1/2] Lancement du serveur frontal (npm run dev)...
start "Serveur Frontal" cmd /k "cd /d "%FRONT_DIR%" && npm run dev"

:: Lancement du serveur backend
echo [ETAPE 2/2] Lancement du serveur backend (symfony serve)...
start "Serveur Backend" cmd /k "cd /d "%BACK_DIR%" && symfony serve"

echo [SUCCESS] Les deux serveurs sont lancés !
echo [INFO] Fermez cette fenêtre pour terminer.
pause
