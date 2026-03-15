import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import DashboardGrid from './components/DashboardGrid/DashboardGrid';
import './App.css';

function App() {
  const [selectedDepartement, setSelectedDepartement] = useState(null);

  // Exemple d'utilisation dans Header : setSelectedDepartement(dep)
  // Exemple d'utilisation dans DashboardGrid : affichage des stats pour selectedDepartement
  
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-area">
        <Header onDepartementSelect={setSelectedDepartement} />
        <DashboardGrid selectedDepartement={selectedDepartement} />
      </main>
    </div>
  );
}

export default App;
