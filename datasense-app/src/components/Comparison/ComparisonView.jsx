import React, { useState, useEffect } from 'react';
import LineChart from '../chart/LineChart';
import BarChart from '../chart/BarChart';
import DoughnutChart from '../chart/DoughnutChart';
import { Search, ArrowLeftRight, TrendingUp, Home, Activity, Users } from 'lucide-react';
import './ComparisonView.css';
import { useApi } from '../../context/ApiContext';

export default function ComparisonView() {
  const { apiBaseUrl } = useApi();
  const [entiteA, setEntiteA] = useState(null);
  const [entiteB, setEntiteB] = useState(null);
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showResultsA, setShowResultsA] = useState(false);
  const [showResultsB, setShowResultsB] = useState(false);

  useEffect(() => {
    // Fetch all departments/regions for selection
    const fetchDeps = fetch(`${apiBaseUrl}/statistique/departement`).then(res => res.json());
    const fetchRegs = fetch(`${apiBaseUrl}/statistique/region`).then(res => res.json());
    
    Promise.all([fetchDeps, fetchRegs])
      .then(([deps, regs]) => {
        const all = [
          ...deps.map(d => ({ ...d, type: 'departement' })),
          ...regs.map(r => ({ ...r, type: 'region' }))
        ];
        setEntities(all);
      })
      .catch(err => console.error("Error fetching entities:", err));
  }, []);

  useEffect(() => {
    if (entiteA) fetchStats(entiteA, setDataA);
  }, [entiteA]);

  useEffect(() => {
    if (entiteB) fetchStats(entiteB, setDataB);
  }, [entiteB]);

  const fetchStats = (ent, setter) => {
    const apiCode = ent.code.replace(/^0+/, '');
    const endpoint = ent.type === 'region' 
      ? `${apiBaseUrl}/statistique/region/${apiCode}`
      : `${apiBaseUrl}/statistique/logement/${apiCode}`;
    
    fetch(endpoint)
      .then(res => res.json())
      .then(data => setter(data))
      .catch(err => console.error("Error fetching stats:", err));
  };

  const filterEntities = (term) => {
    if (!term) return [];
    return entities.filter(e => 
      e.nom.toLowerCase().includes(term.toLowerCase()) || 
      e.code.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5);
  };

  const transformForChart = (data, field) => {
    if (!data) return { etiquettes: [], donnees: [] };
    const sorted = [...data].sort((a, b) => a.anneePublication - b.anneePublication);
    return {
      etiquettes: sorted.map(d => d.anneePublication),
      donnees: sorted.map(d => parseFloat(d[field]))
    };
  };

  return (
    <div className="comparison-container">
      <div className="comparison-selectors">
        <div className="selector-box">
          <h3>Entité A</h3>
          <div className="search-field">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Chercher département ou région..." 
              value={searchA} 
              onChange={(e) => { setSearchA(e.target.value); setShowResultsA(true); }}
              onFocus={() => setShowResultsA(true)}
            />
          </div>
          {showResultsA && searchA && (
            <div className="search-results-mini">
              {filterEntities(searchA).map(e => (
                <div key={e.code} className="search-item-mini" onClick={() => { setEntiteA(e); setSearchA(e.nom); setShowResultsA(false); }}>
                  <span className={`entity-badge ${e.type}`}>{e.type === 'region' ? 'REG' : 'DPT'}</span>
                  {e.nom} ({e.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="vs-badge">
          <ArrowLeftRight size={24} />
        </div>

        <div className="selector-box">
          <h3>Entité B</h3>
          <div className="search-field">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Chercher département ou région..." 
              value={searchB} 
              onChange={(e) => { setSearchB(e.target.value); setShowResultsB(true); }}
              onFocus={() => setShowResultsB(true)}
            />
          </div>
          {showResultsB && searchB && (
            <div className="search-results-mini">
              {filterEntities(searchB).map(e => (
                <div key={e.code} className="search-item-mini" onClick={() => { setEntiteB(e); setSearchB(e.nom); setShowResultsB(false); }}>
                  <span className={`entity-badge ${e.type}`}>{e.type === 'region' ? 'REG' : 'DPT'}</span>
                  {e.nom} ({e.code})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!(entiteA && entiteB) && (
        <div className="empty-comparison-state fade-in">
          <div className="empty-state-icon">
            <ArrowLeftRight size={48} color="#95a5a6" />
          </div>
          <h2>Commencez votre comparaison</h2>
          <p>
            Veuillez utiliser les barres de recherche ci-dessus pour sélectionner les deux 
            territoires (départements ou régions) que vous souhaitez analyser.
          </p>
          <div className="empty-state-examples">
            <div className="example-item">
              <Activity size={24} color="#3498db" />
              <span>Chômage & Pauvreté</span>
            </div>
            <div className="example-item">
              <Users size={24} color="#27ae60" />
              <span>Évolution de la Population</span>
            </div>
            <div className="example-item">
              <Home size={24} color="#9b59b6" />
              <span>Logement Social et Vacant</span>
            </div>
          </div>
        </div>
      )}

      {entiteA && entiteB && (
        <>
          <div className="comparison-kpi-banner fade-in">
            <div className="kpi-comparison-card">
              <div className="kpi-header">
                <Users size={18} color="#3498db" />
                <h4>Population Actuelle</h4>
              </div>
              <div className="kpi-vs-row">
                <div className="kpi-val entity-a">
                  <span>{dataA ? parseInt(dataA[dataA.length - 1]?.nombreHabitants || 0).toLocaleString('fr-FR') : '...'}</span>
                  <span className="kpi-label">{entiteA.nom}</span>
                </div>
                <div className="kpi-divider">VS</div>
                <div className="kpi-val entity-b">
                  <span>{dataB ? parseInt(dataB[dataB.length - 1]?.nombreHabitants || 0).toLocaleString('fr-FR') : '...'}</span>
                  <span className="kpi-label">{entiteB.nom}</span>
                </div>
              </div>
            </div>

            <div className="kpi-comparison-card">
              <div className="kpi-header">
                <Activity size={18} color="#e74c3c" />
                <h4>Taux de Chômage</h4>
              </div>
              <div className="kpi-vs-row">
                <div className="kpi-val entity-a">
                  <span>{dataA ? parseFloat(dataA[dataA.length - 1]?.tauxChomageT4 || 0).toFixed(1) + '%' : '...'}</span>
                  <span className="kpi-label">{entiteA.nom}</span>
                </div>
                <div className="kpi-divider">VS</div>
                <div className="kpi-val entity-b">
                  <span>{dataB ? parseFloat(dataB[dataB.length - 1]?.tauxChomageT4 || 0).toFixed(1) + '%' : '...'}</span>
                  <span className="kpi-label">{entiteB.nom}</span>
                </div>
              </div>
            </div>

            <div className="kpi-comparison-card">
              <div className="kpi-header">
                <TrendingUp size={18} color="#9b59b6" />
                <h4>Taux de Pauvreté</h4>
              </div>
              <div className="kpi-vs-row">
                <div className="kpi-val entity-a">
                  <span>{dataA ? parseFloat(dataA[dataA.length - 1]?.tauxPauvrete || 0).toFixed(1) + '%' : '...'}</span>
                  <span className="kpi-label">{entiteA.nom}</span>
                </div>
                <div className="kpi-divider">VS</div>
                <div className="kpi-val entity-b">
                  <span>{dataB ? parseFloat(dataB[dataB.length - 1]?.tauxPauvrete || 0).toFixed(1) + '%' : '...'}</span>
                  <span className="kpi-label">{entiteB.nom}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="comparison-charts fade-in">
            <div className="comparison-card">
              <div className="card-header-icon">
                <Activity size={20} color="#ff6384" />
                <h3>Évolution du Chômage (%)</h3>
              </div>
              <BarChart 
                etiquettes={transformForChart(dataA, 'tauxChomageT4').etiquettes}
                donnees={transformForChart(dataA, 'tauxChomageT4').donnees}
                libelle={entiteA.nom}
                couleur="#3498db"
                additionalDatasets={[{
                  label: entiteB.nom,
                  data: transformForChart(dataB, 'tauxChomageT4').donnees,
                  backgroundColor: '#e67e22'
                }]}
              />
            </div>

            <div className="comparison-card">
              <div className="card-header-icon">
                <Activity size={20} color="#9b59b6" />
                <h3>Indicateurs Sociaux Actuels</h3>
              </div>
              <BarChart 
                etiquettes={['Chômage (%)', 'Pauvreté (%)']}
                donnees={[
                  dataA ? parseFloat(dataA[dataA.length - 1]?.tauxChomageT4 || 0) : 0,
                  dataA ? parseFloat(dataA[dataA.length - 1]?.tauxPauvrete || 0) : 0
                ]}
                libelle={entiteA.nom}
                couleur="#3498db"
                additionalDatasets={[{
                  label: entiteB.nom,
                  data: [
                    dataB ? parseFloat(dataB[dataB.length - 1]?.tauxChomageT4 || 0) : 0,
                    dataB ? parseFloat(dataB[dataB.length - 1]?.tauxPauvrete || 0) : 0
                  ],
                  backgroundColor: '#e67e22'
                }]}
              />
            </div>

            <div className="comparison-card">
              <div className="card-header-icon">
                <TrendingUp size={20} color="#3498db" />
                <h3>Évolution de la Population</h3>
              </div>
              <BarChart 
                etiquettes={transformForChart(dataA, 'nombreHabitants').etiquettes}
                donnees={transformForChart(dataA, 'nombreHabitants').donnees}
                libelle={entiteA.nom}
                couleur="#3498db"
                additionalDatasets={[{
                  label: entiteB.nom,
                  data: transformForChart(dataB, 'nombreHabitants').donnees,
                  backgroundColor: '#e67e22'
                }]}
              />
            </div>

            <div className="comparison-card" style={{ gridColumn: "span 1" }}>
              <div className="card-header-icon">
                <Home size={20} color="#27ae60" />
                <h3>Répartition du Logement</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <DoughnutChart 
                    titre={entiteA.nom}
                    etiquettes={['Social', 'Vacant', 'Privé/Autre']}
                    donnees={[
                      dataA ? parseFloat(dataA[dataA.length - 1]?.tauxLogementsSociaux || 0) : 0,
                      dataA ? parseFloat(dataA[dataA.length - 1]?.tauxDeLogementsVacants || 0) : 0,
                      dataA ? 100 - (parseFloat(dataA[dataA.length - 1]?.tauxLogementsSociaux || 0) + parseFloat(dataA[dataA.length - 1]?.tauxDeLogementsVacants || 0)) : 100
                    ]}
                    couleurs={['#3498db', '#9b59b6', '#f1f2f6']}
                  />
                </div>
                <div>
                  <DoughnutChart 
                    titre={entiteB.nom}
                    etiquettes={['Social', 'Vacant', 'Privé/Autre']}
                    donnees={[
                      dataB ? parseFloat(dataB[dataB.length - 1]?.tauxLogementsSociaux || 0) : 0,
                      dataB ? parseFloat(dataB[dataB.length - 1]?.tauxDeLogementsVacants || 0) : 0,
                      dataB ? 100 - (parseFloat(dataB[dataB.length - 1]?.tauxLogementsSociaux || 0) + parseFloat(dataB[dataB.length - 1]?.tauxDeLogementsVacants || 0)) : 100
                    ]}
                    couleurs={['#e67e22', '#27ae60', '#f1f2f6']}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
