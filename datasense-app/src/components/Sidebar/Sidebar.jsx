import { LayoutGrid, Map, Layers, LogOut, User as UserIcon, ArrowLeftRight } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { LOGO_URL } from '../../config';
import './Sidebar.css';

export default function Sidebar({ currentView, onViewChange, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div 
          onClick={() => onViewChange('accueil')} 
          className="logo-link" 
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={logo} 
            alt="Datasense Logo" 
            className="sidebar-logo" 
          />
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
        <div 
          className={`nav-item ${currentView === 'carte' ? 'active' : ''}`}
          onClick={() => onViewChange('carte')}
        >
          <Map size={20} />
          <span>Carte Interactive</span>
        </div>
        <div 
          className={`nav-item ${currentView === 'comparaison' ? 'active' : ''}`}
          onClick={() => onViewChange('comparaison')}
        >
          <ArrowLeftRight size={20} />
          <span>Comparaison</span>
        </div>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div 
            className={`user-info ${currentView === 'profil' ? 'active' : ''}`}
            onClick={() => onViewChange('profil')}
            style={{ cursor: 'pointer' }}
          >
            <div className="user-avatar">
              <UserIcon size={18} />
            </div>
            <div className="user-details">
              <span className="user-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.user}
              </span>
            </div>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={18} />
            <span>{user.roles?.[0] === 'GUEST' ? 'Se connecter' : 'Déconnexion'}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
