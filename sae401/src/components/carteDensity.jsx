import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// GeoJSON des départements français
import franceGeoRaw from '../assets/carte.geojson?raw';
const franceGeo = JSON.parse(franceGeoRaw);

const FranceDensityMap = ({ densityData, populationData }) => {
  const getColor = (value) => {
    if (value === undefined || value === null) return '#eeeeee'; // gris clair pour manquant
    if (value > 400) return '#6b0000';
    if (value > 200) return '#b30000';
    if (value > 100) return '#ff6b6b';
    if (value > 50) return '#ffd166';
    return '#c7f9cc';
  };

  const style = (feature) => {
    let deptCode = feature.properties?.code || feature.properties?.code_dept || feature.properties?.code_departement;
    if (deptCode) deptCode = String(parseInt(deptCode));
    const val = densityData?.[deptCode];

    return {
      fillColor: getColor(val),
      weight: 2,
      opacity: 1,
      color: '#333',
      dashArray: val === undefined ? '5' : '3',
      fillOpacity: val === undefined ? 0.35 : 0.75
    };
  };

  const onEachFeature = (feature, layer) => {
    let deptCode = feature.properties?.code || feature.properties?.code_dept || feature.properties?.code_departement;
    if (deptCode) deptCode = String(parseInt(deptCode));
    const val = densityData?.[deptCode];
    const pop = populationData?.[deptCode];
    const name = feature.properties?.nom || deptCode || 'Inconnu';

    let popup = `<b>${name}</b><br/>`;
    if (val !== undefined && !isNaN(val)) {
      popup += `Densité: <strong>${val.toFixed(1)} hab/km²</strong><br/>`;
    } else {
      popup += '<strong style="color: red">Densité: non disponible</strong><br/>';
    }
    if (pop !== undefined && !isNaN(pop)) {
      popup += `Population: <strong>${Math.round(pop).toLocaleString()}</strong>`;
    }

    layer.bindPopup(popup);
    layer.on('mouseover', function () { this.setStyle({ weight: 3, opacity: 0.9 }); });
    layer.on('mouseout', function () { this.setStyle({ weight: 2, opacity: 1 }); });
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <MapContainer center={[46.5, 2]} zoom={6} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png" attribution='&copy; CartoDB &copy; OpenStreetMap contributors' />
        {franceGeo && <GeoJSON data={franceGeo} style={style} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};

export default FranceDensityMap;
