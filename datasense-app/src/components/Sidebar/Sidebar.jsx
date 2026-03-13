import { LayoutGrid, Target, BarChart2, Home } from 'lucide-react';
import logo from '../../assets/logo.svg';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Datasense Logo" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-item active">
          <LayoutGrid size={20} />
          <span>Accueil</span>
        </div>
        <div className="nav-item">
          <Target size={20} />
          <span>Chômage</span>
        </div>
        <div className="nav-item">
          <BarChart2 size={20} />
          <span>Taux moyen</span>
        </div>
        <div className="nav-item">
          <Home size={20} />
          <span>Taux d'habitation</span>
        </div>
      </nav>
    </aside>
  );
}
