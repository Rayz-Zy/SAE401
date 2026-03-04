import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// GeoJSON des départements français
import franceGeoRaw from '../assets/carte.geojson?raw';
const franceGeo = JSON.parse(franceGeoRaw);

const FranceChomageMap = ({ chomageData }) => {
  const getColor = (value) => {
    if (value === undefined || value === null) return '#cccccc'; // Gris pour données manquantes
    if (value > 12) return '#c90000'; // Rouge pour chômage élevé
    if (value > 8) return '#ff8c1a';  // Orange
    if (value > 5) return '#ffd700';  // Jaune
    return '#00b300';                  // Vert pour chômage bas
  };

  const style = (feature) => {
    // Essayer d'obtenir le code département de plusieurs façons
    let deptCode = feature.properties?.code 
      || feature.properties?.code_dept 
      || feature.properties?.code_departement;
    
    // Convertir en string et enlever les zéros leading si nécessaire
    if (deptCode) {
      deptCode = String(parseInt(deptCode));
    }
    
    const chomageValue = chomageData?.[deptCode];
    
    return {
      fillColor: getColor(chomageValue),
      weight: 2,
      opacity: 1,
      color: '#333',
      dashArray: chomageValue === undefined ? '5' : '3',
      fillOpacity: chomageValue === undefined ? 0.4 : 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    let deptCode = feature.properties?.code 
      || feature.properties?.code_dept 
      || feature.properties?.code_departement;
    
    if (deptCode) {
      deptCode = String(parseInt(deptCode));
    }
    
    const chomageValue = chomageData?.[deptCode];
    const deptName = feature.properties?.nom || deptCode || 'Inconnu';
    
    let popupText = `<b>${deptName}</b><br/>`;
    if (chomageValue !== undefined && chomageValue !== null) {
      let niveau = 'Faible';
      if (chomageValue > 12) niveau = 'Élevé';
      else if (chomageValue > 8) niveau = 'Moyen';
      popupText += `Taux de chômage: <strong>${chomageValue.toFixed(1)}%</strong><br/>Niveau: ${niveau}`;
    } else {
      popupText += '<strong style="color: red;">Données non disponibles</strong>';
    }
    
    layer.bindPopup(popupText);
    layer.on('mouseover', function () {
      this.setStyle({ weight: 3, opacity: 0.9 });
    });
    layer.on('mouseout', function () {
      this.setStyle({ weight: 2, opacity: 1 });
    });
  };

  // Compter les données disponibles
  const totalDepts = Object.keys(chomageData || {}).length;

  return (
    <div>
      <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '10px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>📊 Taux de chômage par département</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#00b300' }}></div>
            <span>Faible (&lt;5%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ffd700' }}></div>
            <span>Moyen-bas (5-8%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ff8c1a' }}></div>
            <span>Moyen (8-12%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#c90000' }}></div>
            <span>Élevé (&gt;12%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#cccccc' }}></div>
            <span>Données manquantes</span>
          </div>
        </div>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
          ✓ Données disponibles: {totalDepts} département(s)
        </p>
      </div>
      
      <div style={{ width: '100%', height: '500px' }}>
        <MapContainer 
          center={[46.5, 2]} 
          zoom={6} 
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
            attribution='&copy; CartoDB &copy; OpenStreetMap contributors'
          />
          {franceGeo && <GeoJSON data={franceGeo} style={style} onEachFeature={onEachFeature} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default FranceChomageMap;

