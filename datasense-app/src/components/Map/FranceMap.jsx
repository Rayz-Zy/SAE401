import React, { useState, useEffect, useMemo } from 'react';
import './FranceMap.css';
import { departmentsData } from './departmentsData';
import { Info, Search, Map as MapIcon, ArrowRight, TrendingUp, Users, Activity } from 'lucide-react';
import { useApi } from '../../context/ApiContext';

export default function FranceMap({ onDepartementSelect, selectedId }) {
  const { apiBaseUrl } = useApi();
  const [hoveredDpt, setHoveredDpt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('tauxChomageT4');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showMetricMenu, setShowMetricMenu] = useState(false);

  // Metric definitions for labels and scaling
  const metrics = {
    tauxChomageT4: { label: 'Chômage', unit: '%', color: 'red' },
    tauxPauvrete: { label: 'Pauvreté', unit: '%', color: 'purple' },
    densitePopulation: { label: 'Densité', unit: ' hab/km²', color: 'blue' },
    tauxDeLogementsVacants: { label: 'Log. Vacants', unit: '%', color: 'orange' }
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/statistique/logement`);
        const data = await response.json();
        // Filter for latest year
        const latestStats = data.filter(s => s.anneePublication === 2023);
        setStats(latestStats);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  }, []);

  // Map of dpt code to its stats for quick lookup
  const statsMap = useMemo(() => {
    const map = {};
    stats.forEach(s => {
      if (s.departement) map[s.departement.code] = s;
    });
    return map;
  }, [stats]);

  // Calculate scaling for colors
  const metricBounds = useMemo(() => {
    if (stats.length === 0) return { min: 0, max: 1 };
    
    const getVal = (s) => {
      const v = parseFloat(s[activeMetric] || 0);
      return activeMetric === 'densitePopulation' ? Math.log10(v + 1) : v;
    };

    const values = stats.map(getVal);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max: max === min ? min + 1 : max };
  }, [stats, activeMetric]);

  const getColor = (dptId) => {
    const dptStats = statsMap[dptId];
    if (!dptStats) return '#e6ebf1';
    
    const rawVal = parseFloat(dptStats[activeMetric] || 0);
    const val = activeMetric === 'densitePopulation' ? Math.log10(rawVal + 1) : rawVal;
    
    const { min, max } = metricBounds;
    const intensity = (val - min) / (max - min);
    
    const colors = {
      tauxChomageT4: { h: 0, s: 70 },      // Red
      tauxPauvrete: { h: 280, s: 60 },     // Purple
      densitePopulation: { h: 210, s: 70 }, // Blue
      tauxDeLogementsVacants: { h: 30, s: 80 } // Orange
    };
    
    const config = colors[activeMetric] || { h: 210, s: 70 };
    return `hsl(${config.h}, ${config.s}%, ${95 - intensity * 50}%)`;
  };

  const handleMouseMove = (e) => {
    setTooltipPos({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  const filteredDeps = searchTerm ? departmentsData.filter(d => 
    d.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.includes(searchTerm)
  ) : [];

  // Determine which department to show in the info card
  // If hovering, show that. If searching and only a few results, show the first one.
  const displayedDpt = hoveredDpt || (filteredDeps.length > 0 && filteredDeps.length < 5 ? filteredDeps[0] : null);

  return (
    <div className="france-map-layout">
      <div className="map-sidebar">
        <div className="map-search-card">
          <div className="search-input-wrapper">
            <Search size={18} color="#95a5a6" />
            <input 
              type="text" 
              placeholder="Chercher un département..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredDeps.length > 0) {
                  onDepartementSelect({ code: filteredDeps[0].id, nom: filteredDeps[0].nom, type: 'departement' });
                }
              }}
            />
          </div>
        </div>

        <div className="metric-selector">
          <h4>Visualiser par :</h4>
          <div className="dropdown-container">
            <button 
              className={`metric-dropdown-btn ${showMetricMenu ? 'open' : ''}`}
              onClick={() => setShowMetricMenu(!showMetricMenu)}
            >
              <div className="btn-label-group">
                <div className={`dot ${metrics[activeMetric].color}`} />
                {metrics[activeMetric].label}
              </div>
              <ArrowRight size={16} className={`arrow-icon ${showMetricMenu ? 'rotate' : ''}`} />
            </button>
            
            {showMetricMenu && (
              <div className="metric-menu fade-in">
                {Object.entries(metrics).map(([key, info]) => (
                  <button 
                    key={key}
                    className={`menu-item ${activeMetric === key ? 'active' : ''}`}
                    onClick={() => {
                      setActiveMetric(key);
                      setShowMetricMenu(false);
                    }}
                  >
                    <div className={`dot ${info.color}`} />
                    {info.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="map-info-card">
          {displayedDpt ? (
            <div className="info-content fade-in" key={displayedDpt.id}>
              <div className="info-header">
                <div className="dpt-badge">{displayedDpt.id}</div>
                <h3>{displayedDpt.nom}</h3>
              </div>
              <p className="description">Explorez les données de ce territoire.</p>
              <div className="mini-stats">
                <div className="mini-stat-item">
                  <Activity size={16} color="#3498db" />
                  <span>Statistiques disponibles</span>
                </div>
              </div>
              <button 
                className="view-details-btn"
                onClick={() => onDepartementSelect({ code: displayedDpt.id, nom: displayedDpt.nom, type: 'departement' })}
              >
                Voir le dashboard <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="info-placeholder">
              <MapIcon size={40} color="#ecf0f1" />
              <p>Survolez un département pour voir les détails</p>
            </div>
          )}
        </div>

        <div className="map-stats-summary">
          <div className="summary-item">
            <Users size={16} />
            <span>96 Départements</span>
          </div>
          <div className="summary-item">
            <TrendingUp size={16} />
            <span>Données 2023 (Latest)</span>
          </div>
        </div>
      </div>

      <div className="france-map-main" onMouseMove={handleMouseMove}>
        <div className="france-map-container">
          {loading && <div className="map-loader">Chargement des données...</div>}
          <svg
            viewBox="0 0 613 585"
            className="france-map-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {departmentsData.map((dpt) => {
              const matchesSearch = searchTerm && (
                dpt.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                dpt.id.includes(searchTerm)
              );
              
              const dptStats = statsMap[dpt.id];
              const rawValue = dptStats ? dptStats[activeMetric] : null;

              return (
                <path
                  key={dpt.id}
                  id={`dpt-${dpt.id}`}
                  d={dpt.d}
                  style={{ 
                    fill: getColor(dpt.id),
                    transition: 'fill 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}
                  className={`department-path ${selectedId === dpt.id ? 'selected' : ''} ${matchesSearch ? 'highlight' : ''}`}
                  onMouseEnter={() => {
                    setHoveredDpt(dpt);
                  }}
                  onMouseLeave={() => setHoveredDpt(null)}
                  onClick={() => onDepartementSelect({ code: dpt.id, nom: dpt.nom, type: 'departement' })}
                >
                  <title>{dpt.nom} ({dpt.id}) : {rawValue || 'N/A'}{rawValue ? metrics[activeMetric].unit : ''}</title>
                </path>
              );
            })}
          </svg>
          
          <div className="map-legend">
            <div className="legend-scale">
              <span>{activeMetric === 'densitePopulation' ? Math.pow(10, metricBounds.min).toFixed(0) : metricBounds.min}{metrics[activeMetric].unit}</span>
              <div 
                className="gradient-bar" 
                style={{ background: `linear-gradient(to right, #f8f9fa, ${getColorHex(activeMetric)})` }}
              ></div>
              <span>{activeMetric === 'densitePopulation' ? Math.pow(10, metricBounds.max).toFixed(0) : metricBounds.max}{metrics[activeMetric].unit}</span>
            </div>
            <p><Info size={14} /> Cliquez pour plus de détails</p>
          </div>
        </div>
          
        {hoveredDpt && (
          <div 
            className="map-floating-tooltip"
            style={{ 
              left: tooltipPos.x, 
              top: tooltipPos.y
            }}
          >
            <div className="tooltip-dpt-code">{hoveredDpt.id}</div>
            <div className="tooltip-content">
              <strong>{hoveredDpt.nom}</strong>
              <div className="tooltip-value">
                {metrics[activeMetric].label} : <span>{statsMap[hoveredDpt.id]?.[activeMetric] || 'N/A'} {metrics[activeMetric].unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to get hex color for gradient
function getColorHex(metric) {
  const hex = {
    tauxChomageT4: '#e74c3c',
    tauxPauvrete: '#9b59b6',
    densitePopulation: '#3498db',
    tauxDeLogementsVacants: '#e67e22'
  };
  return hex[metric] || '#3498db';
}
