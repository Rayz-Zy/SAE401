import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import DashboardGrid from './components/DashboardGrid/DashboardGrid';
import './App.css';

function App() {
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [currentView, setCurrentView] = useState('accueil'); // 'accueil', 'departements' ou 'regions'

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    setSelectedDepartement(null); // Réinitialise la sélection lors du changement de vue
  };
  
  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      <main className="main-area">
        <Header onDepartementSelect={setSelectedDepartement} currentView={currentView} onViewChange={handleViewChange} />
        <DashboardGrid selectedDepartement={selectedDepartement} currentView={currentView} />
      </main>
    </div>
  );
}

export default App;
