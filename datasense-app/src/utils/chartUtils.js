/**
 * Transforme les statistiques brutes de l'API en format compatible avec Chart.js.
 * Attend un tableau d'objets avec anneePublication.
 */
export const transformer_stats_pour_graphique = (statistiques, cle_donnee) => {
    if (!statistiques || !Array.isArray(statistiques)) return { labels: [], datasets: [] };

    // Tri par année croissante
    const statistiques_triees = [...statistiques].sort((a, b) => a.anneePublication - b.anneePublication);

    const etiquettes = statistiques_triees.map(item => item.anneePublication.toString());
    const donnees = statistiques_triees.map(item => {
        // Gère les clés imbriquées si nécessaire (ex: 'departement.nom')
        const cles = cle_donnee.split('.');
        let valeur = item;
        for (const cle of cles) {
            valeur = valeur?.[cle];
        }
        // Convertit en nombre si c'est une chaîne (ex: "243.00")
        return typeof valeur === 'string' ? parseFloat(valeur) : valeur;
    });

    return { etiquettes, donnees };
};

/**
 * Récupère la valeur la plus récente d'une clé spécifique dans le tableau de statistiques.
 */
export const obtenir_derniere_valeur = (statistiques, cle_donnee) => {
    if (!statistiques || !Array.isArray(statistiques) || statistiques.length === 0) return null;

    // Tri par année décroissante pour avoir la plus récente en premier
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
