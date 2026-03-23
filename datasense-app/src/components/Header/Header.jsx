import { useState, useEffect, useMemo } from 'react';
import { Search, Globe, Server } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { useApi } from '../../context/ApiContext';
import { LOGO_URL } from '../../config';
import './Header.css';

export default function Header({ onDepartementSelect, currentView, onViewChange }) {
  const { apiBaseUrl, isLocalMode, toggleApiMode } = useApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [entities, setEntities] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // 1. Appel API au montage ou changement de vue
  useEffect(() => {
    if (currentView === 'accueil' || currentView === 'departements' || currentView === 'regions') {
      const fetchDepartments = fetch(`${apiBaseUrl}/statistique/departement`)
        .then(res => res.json())
        .then(data => data.map(d => ({ ...d, type: 'departement' })));

      const fetchRegions = fetch(`${apiBaseUrl}/statistique/region`)
        .then(res => res.json())
        .then(data => data.map(r => ({ ...r, type: 'region' })));

      if (currentView === 'accueil') {
        Promise.all([fetchDepartments, fetchRegions])
          .then(([deps, regs]) => setEntities([...deps, ...regs]))
          .catch(err => console.error("Erreur lors de la récupération globale:", err));
      } else if (currentView === 'regions') {
        fetchRegions.then(data => setEntities(data));
      } else {
        fetchDepartments.then(data => setEntities(data));
      }
    }
    // Reset de la recherche à chaque changement de vue
    setSearchTerm('');
  }, [currentView]);

  // 2. Filtrage des données
  const filteredEntities = useMemo(() => {
    if (!searchTerm) return [];

    const lowerCaseSearch = searchTerm.toLowerCase();

    return entities.filter(ent =>
      ent.nom.toLowerCase().includes(lowerCaseSearch) ||
      ent.code.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm, entities]);

  // Gestion de la sélection
  const handleSelect = (ent) => {
    if (onDepartementSelect) {
      onDepartementSelect(ent);
    }
    setSearchTerm(`${ent.code} - ${ent.nom}`);
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredEntities.length > 0) {
      handleSelect(filteredEntities[0]);
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">
          {currentView === 'accueil' ? 'Accueil' :
            currentView === 'regions' ? 'Régions' :
              currentView === 'carte' ? 'Carte Interactive' :
                currentView === 'comparaison' ? 'Comparaison' :
                  'Départements'}
        </h1>
      </div>
      <div className="header-center">
        <div
          onClick={(e) => {
            e.preventDefault();
            onViewChange('accueil');
          }}
          className="logo-link"
          style={{ cursor: 'pointer' }}
        >
          <img
            src="/logo.svg"
            onError={(e) => { e.target.src = LOGO_URL; }}
            alt="Datasense Logo"
            className="header-logo"
          />
        </div>

        <div className="search-container">
          <div className="search-bar">
            <Search size={18} color="#999" />
            <input
              type="text"
              placeholder={
                currentView === 'comparaison' || currentView === 'accueil'
                  ? "Rechercher département ou région..."
                  : `Rechercher un ${currentView === 'regions' ? 'région' : 'département'}`
              }
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Menu déroulant d'autocomplétion */}
          {isFocused && searchTerm && filteredEntities.length > 0 && (
            <ul className="search-results">
              {filteredEntities.map(ent => (
                <li
                  key={`${ent.type}-${ent.code}`}
                  className="search-item"
                  onClick={() => handleSelect(ent)}
                >
                  <div className="search-item-info">
                    <span className="search-item-code">{ent.code}</span>
                    <span className="search-item-nom">{ent.nom}</span>
                  </div>
                  <span className={`search-item-type ${ent.type}`}>
                    {ent.type === 'region' ? 'Région' : 'Dépt'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="header-right">
        <button
          className={`api-toggle-btn ${isLocalMode ? 'local' : 'online'}`}
          onClick={toggleApiMode}
          title={isLocalMode ? "Passer en mode en ligne" : "Passer en mode local (127.0.0.1:8000)"}
        >
          {isLocalMode ? <Server size={20} /> : <Globe size={20} />}
          <span>{isLocalMode ? 'API Locale' : 'API en ligne'}</span>
        </button>
      </div>
    </header>
  );
}
