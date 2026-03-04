import React, { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import franceGeoRaw from '../assets/carte.geojson?raw'

const franceGeo = JSON.parse(franceGeoRaw)

// compute centroid for a polygon/multiPolygon (simple average of first ring coords)
function computeCentroid(coords) {
  // coords: for Polygon -> [ [ [lng, lat], ... ] ]
  try {
    const ring = coords[0];
    let sumX = 0, sumY = 0, n = 0
    for (const pt of ring) {
      sumX += pt[1] // lat
      sumY += pt[0] // lng
      n++
    }
    return [sumX / n, sumY / n]
  } catch (e) {
    return null
  }
}

const FranceBubblesMap = ({ densityData = {}, populationData = {}, sizeBy = 'density' }) => {
  const points = useMemo(() => {
    const arr = []
    if (!franceGeo || !franceGeo.features) return arr
    for (const feat of franceGeo.features) {
      let code = feat.properties?.code || feat.properties?.code_dept || feat.properties?.code_departement
      if (code) code = String(parseInt(code))
      const geometry = feat.geometry
      if (!geometry) continue
      let centroid = null
      if (geometry.type === 'Polygon') centroid = computeCentroid(geometry.coordinates)
      else if (geometry.type === 'MultiPolygon') centroid = computeCentroid(geometry.coordinates[0])
      if (!centroid) continue

      const val = sizeBy === 'population' ? populationData[code] : densityData[code]
      arr.push({ code, name: feat.properties?.nom || feat.properties?.name || code, lat: centroid[0], lng: centroid[1], value: val })
    }
    return arr
  }, [densityData, populationData, sizeBy])

  const getRadius = (v) => {
    if (v === undefined || v === null || isNaN(v)) return 2
    // scale: sqrt for better visual, tuned factor
    return Math.max(3, Math.sqrt(v) * 0.7)
  }

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <MapContainer center={[46.5, 2]} zoom={6} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png" attribution='&copy; CartoDB &copy; OpenStreetMap contributors' />
        {points.map(p => (
          <CircleMarker key={p.code} center={[p.lat, p.lng]} radius={getRadius(p.value)} color="#d90429" fillColor="#ff6b6b" fillOpacity={0.7} weight={1}>
            <Tooltip direction="top" offset={[0, -5]}>
              <div><strong>{p.name}</strong><br />{p.value !== undefined ? `${p.value} ${sizeBy === 'population' ? 'hab' : 'hab/km²'}` : 'Donnée manquante'}</div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

export default FranceBubblesMap
