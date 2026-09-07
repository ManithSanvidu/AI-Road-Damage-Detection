import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView() {
  const [damageReports, setDamageReports] = React.useState([]);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:8000/reports');
        if (response.ok) {
          const data = await response.json();
          setDamageReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
    // Refresh every 5 seconds for real-time feel
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Real-Time Damage Map</h2>
      
      <div className="h-[500px] w-full rounded-lg overflow-hidden border">
        {/* Center coordinates (Sri Lanka used as example) and initial zoom */}
        <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {damageReports
            .filter(report => report.latitude != null && report.longitude != null)
            .map((report) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <div className="font-semibold">{report.damage_type}</div>
                <div className="text-sm text-gray-600">Severity: {report.severity}</div>
                {report.description && <div className="text-xs text-gray-500 mt-1">{report.description}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}