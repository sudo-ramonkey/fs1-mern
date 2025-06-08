import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';

// Fix for default markers in production
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom guitar store icon
const guitarStoreIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1e40af" width="32" height="32">
      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"/>
      <circle cx="12" cy="9" r="1" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const InteractiveMap = ({ 
  latitude = 25.53516719,
  longitude = -103.4348953, 
  zoom = 16,
  storeName = "El mundo de las guitarras",
  address = "Blvd. Revolución y, Av. Instituto Tecnológico de La Laguna s/n, Primero de Cobián Centro, 27000 Torreón, Coah."
}) => {
  const position = [latitude, longitude];

  return (
    <div className="interactive-map">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        className="map-container"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={guitarStoreIcon}>
          <Popup>
            <div className="map-popup">
              <h4>🎸 {storeName}</h4>
              <p>{address}</p>
              <div className="popup-actions">
                <a 
                  href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=${zoom}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  Ver en OpenStreetMap
                </a>
                <a 
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  Ver en Google Maps
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
