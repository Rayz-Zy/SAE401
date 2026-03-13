import { Search } from 'lucide-react';
import logo from '../../assets/logo.svg';
import './Header.css';

export default function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">Accueil</h1>
      </div>
      <div className="header-center">
        <img src={logo} alt="Datasense Logo" className="header-logo" />
        <div className="search-bar">
          <Search size={18} color="#999" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>
    </header>
  );
}
