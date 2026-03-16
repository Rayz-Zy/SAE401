/**
 * Transforme les statistiques brutes de l'API en format compatible avec Chart.js.
 * Attend un tableau d'objets avec anneePublication.
 * 
 * @param {Array} statistiques - Les données brutes reçues de l'API 
 * @param {string} cle_donnee - Le nom du champ à extraire (ex: 'nombreHabitants')
 * @returns {Object} - Un objet contenant les étiquettes (X) et les données (Y)
 */
export const transformer_stats_pour_graphique = (statistiques, cle_donnee) => {
    if (!statistiques || !Array.isArray(statistiques)) return { etiquettes: [], donnees: [] };

    // Tri par année croissante pour que le graphique aille de gauche à droite
    const statistiques_triees = [...statistiques].sort((a, b) => a.anneePublication - b.anneePublication);

    // Extraction des années pour l'axe X
    const etiquettes = statistiques_triees.map(item => item.anneePublication.toString());
    
    // Extraction des valeurs pour l'axe Y
    const donnees = statistiques_triees.map(item => { // On parcourt les données pour extraire les valeurs
        const cles = cle_donnee.split('.'); // On sépare les clés imbriquées
        let valeur = item;  // On initialise la valeur
        for (const cle of cles) {   // On parcourt les clés imbriquées
            valeur = valeur?.[cle]; // On accède à la valeur imbriquée
        }
        return typeof valeur === 'string' ? parseFloat(valeur) : valeur; // On retourne la valeur
    });

    return { etiquettes, donnees };
};

/**
 * Récupère la valeur la plus récente d'une clé spécifique dans le tableau de statistiques.
 * 
 * @param {Array} statistiques - Les données brutes reçues de l'API
 * @param {string} cle_donnee - Le nom du champ à extraire
 * @returns {Object|null} - La valeur la plus récente et son année associée
 */
export const obtenir_derniere_valeur = (statistiques, cle_donnee) => {
    if (!statistiques || !Array.isArray(statistiques) || statistiques.length === 0) return null;

    // Tri par année décroissante pour isoler l'année la plus récente (le premier élément)
    const statistiques_triees = [...statistiques].sort((a, b) => b.anneePublication - a.anneePublication);
    const dernier = statistiques_triees[0];

    // Gère les clés imbriquées
    const cles = cle_donnee.split('.');
    let valeur = dernier;
    for (const cle of cles) {
        valeur = valeur?.[cle];
    }

    return {
        valeur: typeof valeur === 'string' ? parseFloat(valeur) : valeur,
        annee: dernier.anneePublication
    };
};
