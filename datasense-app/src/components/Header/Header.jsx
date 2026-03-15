import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import logo from '../../assets/logo.svg';
import './Header.css';

export default function Header({ onDepartementSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departements, setDepartements] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // 1. Appel API au montage du composant
  useEffect(() => {
    fetch('http://127.0.0.1:8000/statistic/departement')
      .then(res => res.json())
      .then(data => setDepartements(data))
      .catch(err => console.error("Erreur lors de la récupération des départements:", err));
  }, []);

  // 2. Filtrage des données
  const filteredDepartements = useMemo(() => {
    if (!searchTerm) return [];
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return departements.filter(dep => 
      dep.nom.toLowerCase().includes(lowerCaseSearch) ||
      dep.code.includes(lowerCaseSearch)
    );
  }, [searchTerm, departements]);

  // Gestion de la sélection
  const handleSelect = (dep) => {
    if (onDepartementSelect) {
      onDepartementSelect(dep);
    }
    setSearchTerm(`${dep.code} - ${dep.nom}`); // Affiche le choix dans l'input
    setIsFocused(false); // Ferme la liste
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">Accueil</h1>
      </div>
      <div className="header-center">
        <img src={logo} alt="Datasense Logo" className="header-logo" />
        
        <div className="search-container">
          <div className="search-bar">
            <Search size={18} color="#999" />
            <input 
              type="text" 
              placeholder="Rechercher par numéro ou nom" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Laisse le temps au clic de s'enregistrer
            />
          </div>
          
          {/* Menu déroulant d'autocomplétion */}
          {isFocused && searchTerm && filteredDepartements.length > 0 && (
            <ul className="search-results">
              {filteredDepartements.map(dep => (
                <li 
                  key={dep.code} 
                  className="search-item" 
                  onClick={() => handleSelect(dep)}
                >
                  <span className="search-item-code">{dep.code}</span>
                  <span className="search-item-nom">{dep.nom}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
