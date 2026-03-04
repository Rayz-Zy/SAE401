import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';   
import 'rsuite/dist/rsuite.min.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Header from './components/header.jsx';
import Home from './pages/Home.jsx'
import Carte from './pages/Carte.jsx'
import DepartementSearch from './pages/DepartementSearch.jsx'

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [expanded, setExpanded] = useState(true)

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Header expanded={expanded} setExpanded={setExpanded} />

        <div style={{
          marginLeft: expanded ? '260px' : '56px',
          width: `calc(100% - ${expanded ? '260px' : '56px'})`,
          transition: 'margin-left 0.3s',
          overflowY: 'auto'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departement-search" element={<DepartementSearch />} />
            <Route path="/carte" element={<Carte />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
