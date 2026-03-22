import React, { useState } from 'react';
import './FranceMap.css';
import { departmentsData } from './departmentsData';
import { Info, Search, Map as MapIcon, ArrowRight, TrendingUp, Users, Activity } from 'lucide-react';

export default function FranceMap({ onDepartementSelect, selectedId }) {
  const [hoveredDpt, setHoveredDpt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
            <span>Données 2021-2023</span>
          </div>
        </div>
      </div>

      <div className="france-map-main">
        <div className="france-map-container">
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
              
              return (
                <path
                  key={dpt.id}
                  id={`dpt-${dpt.id}`}
                  d={dpt.d}
                  className={`department-path ${selectedId === dpt.id ? 'selected' : ''} ${matchesSearch ? 'highlight' : ''}`}
                  onMouseEnter={() => setHoveredDpt(dpt)}
                  onMouseLeave={() => setHoveredDpt(null)}
                  onClick={() => onDepartementSelect({ code: dpt.id, nom: dpt.nom, type: 'departement' })}
                >
                  <title>{dpt.nom} ({dpt.id})</title>
                </path>
              );
            })}
          </svg>
          <div className="map-legend">
            <p><Info size={14} inline /> Cliquez sur un département pour accéder au tableau de bord complet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
