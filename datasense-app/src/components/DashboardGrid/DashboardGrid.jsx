import './DashboardGrid.css';
import React, { useState, useEffect, useMemo } from 'react';
import LineChart from '../chart/LineChart';
import BarChart from '../chart/BarChart';
import DoughnutChart from '../chart/DoughnutChart';
import MixedChart from '../chart/MixedChart';
import StatCard from './StatCard';
import { transformer_stats_pour_graphique, obtenir_derniere_valeur } from '../../utils/chartUtils';
import { Users, Home, TrendingUp, Percent, Info, Activity, PieChart as PieIcon, Lightbulb } from 'lucide-react';
import DataInsights from './DataInsights';
import { useApi } from '../../context/ApiContext';

export default function DashboardGrid({ selectedDepartement, currentView }) {
  const { apiBaseUrl } = useApi();
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
      ? `${apiBaseUrl}/statistique/region/${selectedDepartement.code}`
      : `${apiBaseUrl}/statistique/logement/${selectedDepartement.code}`;

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

  const donnees_age_moyen = useMemo(() =>
    transformer_stats_pour_graphique(stats, 'parcSocialAgeMoyen'),
    [stats]
  );

  const donnees_energivores = useMemo(() =>
    transformer_stats_pour_graphique(stats, 'parcSocialTauxLogementsEnergivores'),
    [stats]
  );

  // --- 3. EXTRACTION DES DERNIÈRES VALEURS (KPIs) ---
  const derniere_population = useMemo(() => obtenir_derniere_valeur(stats, 'nombreHabitants'), [stats]);
  const derniers_logements_sociaux = useMemo(() => obtenir_derniere_valeur(stats, 'tauxLogementsSociaux'), [stats]);
  const derniers_logements_vacants = useMemo(() => obtenir_derniere_valeur(stats, 'tauxDeLogementsVacants'), [stats]);
  const derniere_pop_jeune = useMemo(() => obtenir_derniere_valeur(stats, 'pourcentageMoins20Ans'), [stats]);
  const derniere_densite = useMemo(() => obtenir_derniere_valeur(stats, 'densitePopulation'), [stats]);
  const dernier_chomage = useMemo(() => obtenir_derniere_valeur(stats, 'tauxChomageT4'), [stats]);

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
                <div className="dashboard-stat-row" style={{ gridColumn: "span 3" }}>
                  <StatCard
                    libelle="Population totale"
                    valeur={derniere_population?.valeur}
                    annee={derniere_population?.annee}
                    unite="hab."
                    icone={<Users size={24} />}
                    couleur="#4bc0c0"
                  />
                  <StatCard
                    libelle="Densité Population"
                    valeur={derniere_densite?.valeur}
                    annee={derniere_densite?.annee}
                    unite="hab/km²"
                    icone={<Activity size={24} />}
                    couleur="#3498db"
                  />
                  <StatCard
                    libelle="Taux de Chômage"
                    valeur={dernier_chomage?.valeur}
                    annee={dernier_chomage?.annee}
                    unite="%"
                    icone={<TrendingUp size={24} />}
                    couleur="#e67e22"
                  />
                  <StatCard
                    libelle="Insights Flash"
                    valeur={<DataInsights stats={stats} />}
                    couleur="#f1c40f"
                    icone={<Lightbulb size={24} />}
                  />
                </div>

                {/* Graphiques d'évolution (Ligne 1) */}
                {/* On passe 'etiquettes' (X) et 'donnees' (Y) au composant LineChart */}
                {/* Graphiques Dynamiques (Ligne 1) */}
                <div className="dashboard-card" style={{ gridColumn: "span 1" }}>
                  <div className="card-header-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '15px' }}>
                    <Activity size={18} color="#ff6384" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#2c3e50' }}>Social (Chômage/Pauvreté)</h3>
                  </div>
                  <div style={{ padding: '0 15px 15px' }}>
                    <BarChart
                      etiquettes={donnees_chomage.etiquettes}
                      donnees={donnees_chomage.donnees}
                      titre=""
                      libelle="Chômage (%)"
                      couleur="rgba(255, 99, 132, 0.7)"
                      additionalDatasets={[{
                        label: 'Pauvreté (%)',
                        data: donnees_pauvrete.donnees,
                        backgroundColor: 'rgba(255, 159, 64, 0.7)'
                      }]}
                    />
                  </div>
                </div>


                {/* Graphiques de Contexte (Ligne 2) */}
                <div className="dashboard-card" style={{ gridColumn: "span 1" }}>
                  <div style={{ padding: '20px' }}>
                    <LineChart
                      etiquettes={donnees_population.etiquettes}
                      donnees={donnees_population.donnees}
                      titre="Évolution de la population"
                      libelle="Habitants"
                      couleur="rgba(75, 192, 192, 1)"
                      fill={true}
                    />
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-header-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '15px' }}>
                    <PieIcon size={18} color="#e67e22" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#2c3e50' }}>Répartition du Logement</h3>
                  </div>
                  <div style={{ padding: '0 15px 15px' }}>
                    <DoughnutChart
                      etiquettes={['Social', 'Vacant', 'Privé/Autre']}
                      donnees={[
                        derniers_logements_sociaux?.valeur || 0,
                        derniers_logements_vacants?.valeur || 0,
                        100 - ((derniers_logements_sociaux?.valeur || 0) + (derniers_logements_vacants?.valeur || 0))
                      ]}
                      titre="Composition du parc"
                      couleurs={['#3498db', '#e67e22', '#ecf0f1']}
                    />
                  </div>
                </div>

                <div className="dashboard-card" style={{ gridColumn: "span 2" }}>
                  <div className="card-header-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '15px' }}>
                    <Home size={18} color="#9b59b6" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#2c3e50' }}>Performance du Parc Social</h3>
                  </div>
                  <div style={{ padding: '0 15px 15px' }}>
                    <MixedChart
                      etiquettes={donnees_age_moyen.etiquettes}
                      donneesBar={donnees_age_moyen.donnees}
                      donneesLine={donnees_energivores.donnees}
                      libelleBar="Âge moyen du parc (ans)"
                      libelleLine="Taux de logements énergivores (%)"
                      titre="Âge vs Performance Énergétique"
                      couleurBar="rgba(155, 89, 182, 0.6)"
                      couleurLine="rgba(231, 76, 60, 1)"
                    />
                  </div>
                </div>


                <div className="dashboard-card">
                  <div className="card-header-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', padding: '15px' }}>
                    <Home size={18} color="#9966ff" />
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#2c3e50' }}>Volume de Logements</h3>
                  </div>
                  <div style={{ padding: '0 15px 15px' }}>
                    <LineChart
                      etiquettes={donnees_logements.etiquettes}
                      donnees={donnees_logements.donnees}
                      titre="Évolution des logements"
                      libelle="Nombre de logements"
                      couleur="rgba(153, 102, 255, 1)"
                      fill={true}
                    />
                  </div>
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
