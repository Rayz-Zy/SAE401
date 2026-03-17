import './DashboardGrid.css';
import React, { useState, useEffect, useMemo } from 'react';
import LineChart from '../chart/LineChart';
import StatCard from './StatCard';
import { transformer_stats_pour_graphique, obtenir_derniere_valeur } from '../../utils/chartUtils';
import { Users, Home, TrendingUp, Percent, Info } from 'lucide-react';

export default function DashboardGrid({ selectedDepartement, currentView }) {
  // État pour stocker les données brutes de l'API
  const [stats, setStats] = useState(null);
  const [chargement_en_cours, definir_chargement_en_cours] = useState(false);
  const [erreur, definir_erreur] = useState(null);
  const [modePreview, definir_modePreview] = useState(false);

  // --- 1. RÉCUPÉRATION DES DONNÉES (API) ---
  useEffect(() => {
    if (!selectedDepartement || !selectedDepartement.code) {
      setStats(null);
      return;
    }

    definir_chargement_en_cours(true);
    definir_erreur(null);

    const entityType = selectedDepartement.type || (currentView === 'regions' ? 'region' : 'departement');
    const endpoint = entityType === 'region'
      ? `http://127.0.0.1:8000/statistique/region/${selectedDepartement.code}`
      : `http://127.0.0.1:8000/statistique/logement/${selectedDepartement.code}`;

    fetch(endpoint)
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        return res.json();
      })
      .then(donnees => {
        setStats(donnees);
        definir_chargement_en_cours(false);
      })
      .catch(err => {
        console.error("Erreur API :", err);
        definir_erreur(err.message);
        definir_chargement_en_cours(false);
      });
  }, [selectedDepartement, currentView]);

  // --- 2. TRANSFORMATION DES DONNÉES POUR LES GRAPHIQUES ---
  const donnees_population = useMemo(() =>
    transformer_stats_pour_graphique(stats, 'nombreHabitants'),
    [stats]
  );

  const donnees_chomage = useMemo(() =>
    transformer_stats_pour_graphique(stats, 'tauxChomageT4'),
    [stats]
  );

  const donnees_pauvrete = useMemo(() =>
    transformer_stats_pour_graphique(stats, 'tauxPauvrete'),
    [stats]
  );

  const donnees_logements = useMemo(() =>
    transformer_stats_pour_graphique(stats, 'nombreLogement'),
    [stats]
  );

  // --- 3. EXTRACTION DES DERNIÈRES VALEURS (KPIs) ---
  const derniere_population = useMemo(() => obtenir_derniere_valeur(stats, 'nombreHabitants'), [stats]);
  const derniers_logements_sociaux = useMemo(() => obtenir_derniere_valeur(stats, 'tauxLogementsSociaux'), [stats]);
  const derniers_logements_vacants = useMemo(() => obtenir_derniere_valeur(stats, 'tauxDeLogementsVacants'), [stats]);
  const derniere_pop_jeune = useMemo(() => obtenir_derniere_valeur(stats, 'pourcentageMoins20Ans'), [stats]);

  return (
    <div className="content-wrapper">
      <div className="dashboard-grid">
        {/* En-tête du tableau de bord */}
        <div className="dashboard-header-card" style={{ gridColumn: "span 3" }}>
          <div className="header-info">
            <h2 style={{ margin: 0 }}>
              {selectedDepartement
                ? `Tableau de bord : ${selectedDepartement.nom} (${selectedDepartement.code}) - ${selectedDepartement.type === 'region' ? 'Région' : 'Département'}`
                : modePreview ? "Aperçu des graphiques (données vides)" : `Sélectionnez un ${currentView === 'regions' ? 'région' : 'département'} pour voir ses statistiques`}
            </h2>
            {selectedDepartement && <p className="last-update">Données mises à jour pour 2021-2023</p>}
          </div>
          {!selectedDepartement && (
            <button
              onClick={() => definir_modePreview(prev => !prev)}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                background: modePreview ? '#e74c3c' : '#3498db',
                color: 'white',
                transition: 'background 0.2s',
              }}
            >
              {modePreview ? '✕ Masquer l\'aperçu' : '👁 Aperçu des graphiques'}
            </button>
          )}
        </div>

        {(selectedDepartement || modePreview) && (
          <>
            {/* États de chargement et d'erreur */}
            {chargement_en_cours && (
              <div className="dashboard-card" style={{ gridColumn: "span 3", textAlign: "center", padding: '40px' }}>
                <p>Chargement des statistiques en cours...</p>
              </div>
            )}

            {erreur && (
              <div className="dashboard-card" style={{ gridColumn: "span 3", textAlign: "center", color: '#ff4d4d', padding: '40px' }}>
                <p>Erreur : {erreur}</p>
              </div>
            )}

            {/* --- 4. AFFICHAGE DES COMPOSANTS --- */}
            {(stats || modePreview) && !chargement_en_cours && !erreur && (
              <>
                {/* Ligne des cartes de statistiques (KPIs) */}
                {/* Ici les données transformées sont injectées dans 'valeur' et 'annee' */}
                <div className="dashboard-stat-row" style={{ gridColumn: "span 3", display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <StatCard
                    libelle="Population totale"
                    valeur={derniere_population?.valeur}
                    annee={derniere_population?.annee}
                    unite="hab."
                    icone={<Users size={24} />}
                    couleur="#4bc0c0"
                  />
                  <StatCard
                    libelle="Logements Sociaux"
                    valeur={derniers_logements_sociaux?.valeur}
                    annee={derniers_logements_sociaux?.annee}
                    unite="%"
                    icone={<Home size={24} />}
                    couleur="#3498db"
                  />
                  <StatCard
                    libelle="Logements Vacants"
                    valeur={derniers_logements_vacants?.valeur}
                    annee={derniers_logements_vacants?.annee}
                    unite="%"
                    icone={<Percent size={24} />}
                    couleur="#e67e22"
                  />
                  <StatCard
                    libelle="Moins de 20 ans"
                    valeur={derniere_pop_jeune?.valeur}
                    annee={derniere_pop_jeune?.annee}
                    unite="%"
                    icone={<TrendingUp size={24} />}
                    couleur="#9b59b6"
                  />
                </div>

                {/* Graphiques d'évolution (Ligne 1) */}
                {/* On passe 'etiquettes' (X) et 'donnees' (Y) au composant LineChart */}
                <div className="dashboard-card" style={{ gridColumn: "span 2" }}>
                  <LineChart
                    etiquettes={donnees_population.etiquettes}
                    donnees={donnees_population.donnees}
                    titre="Évolution de la population"
                    libelle="Nombre d'habitants"
                    couleur="rgba(75, 192, 192, 1)"
                  />
                </div>

                <div className="dashboard-card">
                  <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: '#7f8c8d', textTransform: 'uppercase', marginBottom: '15px' }}>Densité actuelle</h3>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                        {stats?.[0]?.densitePopulation ?? '—'}
                      </p>
                      <span style={{ fontSize: '0.9rem', color: '#95a5a6', display: 'block' }}>Habitants / km²</span>
                    </div>
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Info size={16} color="#3498db" />
                      <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Dernier recensement (2023)</span>
                    </div>
                  </div>
                </div>

                {/* Second Row Charts */}
                <div className="dashboard-card">
                  <LineChart
                    etiquettes={donnees_chomage.etiquettes}
                    donnees={donnees_chomage.donnees}
                    titre="Taux de chômage (%)"
                    libelle="Chômage T4"
                    couleur="rgba(255, 99, 132, 1)"
                  />
                </div>

                <div className="dashboard-card">
                  <LineChart
                    etiquettes={donnees_pauvrete.etiquettes}
                    donnees={donnees_pauvrete.donnees}
                    titre="Taux de pauvreté (%)"
                    libelle="Pauvreté"
                    couleur="rgba(255, 159, 64, 1)"
                  />
                </div>

                <div className="dashboard-card">
                  <LineChart
                    etiquettes={donnees_logements.etiquettes}
                    donnees={donnees_logements.donnees}
                    titre="Évolution des logements"
                    libelle="Nombre de logements"
                    couleur="rgba(153, 102, 255, 1)"
                  />
                </div>

                {/* Debug Section */}
                <details className="dashboard-card debug-details" style={{ gridColumn: "span 3" }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#34495e' }}>Visualiser les données brutes (JSON)</summary>
                  <pre className="json-preview">
                    {JSON.stringify(stats, null, 2)}
                  </pre>
                </details>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
