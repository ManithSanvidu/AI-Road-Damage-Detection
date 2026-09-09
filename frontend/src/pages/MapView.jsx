import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create colored icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = createIcon('red');
const orangeIcon = createIcon('orange');
const greenIcon = createIcon('green');

const getSeverityIcon = (severity) => {
  const s = severity?.toLowerCase() || '';
  if (s === 'critical' || s === 'high') return redIcon;
  if (s === 'medium') return orangeIcon;
  return greenIcon;
};

export default function MapView() {
  const [damageReports, setDamageReports] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const districts = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
    "Galle", "Matara", "Hambantota", "Jaffna", "Kurunegala", "Puttalam", 
    "Anuradhapura", "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", "Kegalle"
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('https://ai-road-damage-detection-q6sv.onrender.com/reports');
        if (response.ok) {
          const data = await response.json();
          setDamageReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredReports = damageReports
    .filter(report => report.latitude != null && report.longitude != null)
    .filter(report => report.status !== 'Resolved')
    .filter(report => {
      if (!selectedDistrict) return true;
      return report.description && report.description.includes(`[${selectedDistrict}]`);
    });

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Real-Time Damage Map</h2>
        
        <select 
          value={selectedDistrict} 
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mac-blue outline-none"
        >
          <option value="">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-600"></div> High/Critical</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Medium</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Low</div>
      </div>
      
      <div className="h-[500px] w-full rounded-lg overflow-hidden border">
        <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {filteredReports.map((report) => (
            <Marker 
              key={report.id} 
              position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
              icon={getSeverityIcon(report.severity)}
            >
              <Popup>
                <div className="font-bold text-base mb-1">{report.damage_type}</div>
                <div className="text-sm font-medium">AI-Assessed Severity: <span className={
                  report.severity === 'Critical' || report.severity === 'High' ? 'text-red-600' :
                  report.severity === 'Medium' ? 'text-orange-500' : 'text-green-600'
                }>{report.severity}</span></div>
                <div className="text-sm mt-1 mb-1 font-semibold text-blue-600">Status: {report.status || 'Reported'}</div>
                {report.description && <div className="text-xs text-gray-600 italic border-t pt-1 mt-1">{report.description}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
