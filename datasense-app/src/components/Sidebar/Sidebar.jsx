import { LayoutGrid, Map, Layers } from 'lucide-react';
import logo from '../../assets/logo.svg';
import './Sidebar.css';

export default function Sidebar({ currentView, onViewChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div 
          onClick={() => onViewChange('accueil')} 
          className="logo-link" 
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="Datasense Logo" className="sidebar-logo" />
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${currentView === 'accueil' ? 'active' : ''}`}
          onClick={() => onViewChange('accueil')}
        >
          <LayoutGrid size={20} />
          <span>Accueil</span>
        </div>
        <div 
          className={`nav-item ${currentView === 'departements' ? 'active' : ''}`}
          onClick={() => onViewChange('departements')}
        >
          <Map size={20} />
          <span>Départements</span>
        </div>
        <div 
          className={`nav-item ${currentView === 'regions' ? 'active' : ''}`}
          onClick={() => onViewChange('regions')}
        >
          <Layers size={20} />
          <span>Régions</span>
        </div>
      </nav>
    </aside>
  );
}
