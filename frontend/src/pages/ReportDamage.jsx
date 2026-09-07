import React, { useState } from 'react';
import { MapPin, AlertTriangle, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function ReportDamage() {
  const [formData, setFormData] = useState({
    damage_type: 'Pothole',
    severity: 'Medium',
    latitude: '',
    longitude: '',
    description: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, (err) => {
        alert('Could not get location. Please enter manually.');
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus('Submitting report...');
      const response = await fetch('https://manibro99-road-damage-detection.hf.space/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          damage_type: formData.damage_type,
          severity: formData.severity,
          description: formData.description
        })
      });
      if (response.ok) {
        setStatus('Report submitted successfully!');
        setFormData({ ...formData, description: '' });
      } else {
        setStatus('Failed to submit report.');
      }
    } catch (error) {
      setStatus('Error connecting to server.');
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report Road Damage</h2>
      <p className="text-gray-600 mb-8">
        Help improve road infrastructure by manually reporting damages you encounter. Your report will be instantly plotted on the real-time map.
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        
        {/* Damage Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Damage Type</label>
          <select 
            name="damage_type" 
            value={formData.damage_type} 
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mac-blue focus:border-mac-blue outline-none"
          >
            <option value="Longitudinal">Longitudinal Crack</option>
            <option value="Transverse">Transverse Crack</option>
            <option value="Alligator">Alligator Crack</option>
            <option value="Pothole">Pothole</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
          <div className="flex gap-4">
            {['Low', 'Medium', 'High', 'Critical'].map(level => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="severity" 
                  value={level} 
                  checked={formData.severity === level} 
                  onChange={handleChange}
                  className="w-4 h-4 text-mac-blue focus:ring-mac-blue" 
                />
                <span className="text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District / Area (Sri Lanka)</label>
          <select 
            name="district" 
            value={formData.district || ''} 
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mac-blue focus:border-mac-blue outline-none"
          >
            <option value="">Select a District</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Matale">Matale</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Galle">Galle</option>
            <option value="Matara">Matara</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Badulla">Badulla</option>
            <option value="Moneragala">Moneragala</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Kegalle">Kegalle</option>
          </select>
        </div>

        {/* Interactive Map Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Select Exact Location on Map
          </label>
          <p className="text-xs text-gray-500 mb-3">Click anywhere on the map to pinpoint the exact location of the damage.</p>
          
          <div className="h-[300px] w-full rounded-lg overflow-hidden border mb-3">
            <MapContainer 
              center={[7.8731, 80.7718]} 
              zoom={7} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <LocationMarker 
                position={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                setPosition={(latlng) => setFormData({ ...formData, latitude: latlng.lat, longitude: latlng.lng })}
              />
            </MapContainer>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded border text-sm">
            <div>
              <span className="font-medium">Selected Coordinates: </span>
              {formData.latitude ? `${formData.latitude.toFixed(5)}, ${formData.longitude.toFixed(5)}` : 'None selected'}
            </div>
            <button type="button" onClick={getLocation} className="text-mac-blue hover:underline font-medium">
              Use GPS Location
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Description</label>
          <textarea 
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="E.g. Near the main intersection, very deep pothole causing traffic slowdowns."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-mac-blue outline-none"
          ></textarea>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Send className="w-5 h-5" /> Submit Report
        </button>

        {status && (
          <div className={`p-4 rounded-lg text-center font-medium ${status.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
