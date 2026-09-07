import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, MapPin, Image as ImageIcon, Activity } from 'lucide-react';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    highSeverity: 0,
    longitudinal: 0,
    transverse: 0,
    alligator: 0,
    pothole: 0
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:8000/reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
          
          let high = 0;
          let long = 0, trans = 0, alli = 0, pot = 0;
          
          data.forEach(r => {
            if (r.severity === 'High' || r.severity === 'Critical') high++;
            if (r.damage_type === 'Longitudinal') long++;
            if (r.damage_type === 'Transverse') trans++;
            if (r.damage_type === 'Alligator') alli++;
            if (r.damage_type === 'Pothole') pot++;
          });
          
          setStats({
            total: data.length,
            highSeverity: high,
            longitudinal: long,
            transverse: trans,
            alligator: alli,
            pothole: pot
          });
        }
      } catch (error) {
        console.error('Error fetching reports for dashboard:', error);
      }
    };
    
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'Longitudinal', count: stats.longitudinal },
    { name: 'Transverse', count: stats.transverse },
    { name: 'Alligator', count: stats.alligator },
    { name: 'Pothole', count: stats.pothole },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Scans" value="1,248" icon={ImageIcon} />
        <StatCard title="Damages Reported" value={stats.total} icon={AlertTriangle} trend="+New" />
        <StatCard title="High Severity" value={stats.highSeverity} icon={Activity} color="text-red-500" />
        <StatCard title="Locations Mapped" value={stats.total} icon={MapPin} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mac-card p-6">
          <h2 className="text-sm font-semibold text-mac-gray uppercase mb-6">Damage Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f5f5f7'}} contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" fill="#0066cc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mac-card p-6">
          <h2 className="text-sm font-semibold text-mac-gray uppercase mb-6">Recent Detections</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {reports.slice().reverse().slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 hover:bg-black/5 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.damage_type} reported</p>
                    <p className="text-xs text-mac-gray">
                      {r.latitude != null && r.longitude != null 
                        ? `Lat: ${r.latitude.toFixed(4)}, Lng: ${r.longitude.toFixed(4)}`
                        : 'Location not provided'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  r.severity === 'High' || r.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                  r.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                }`}>
                  {r.severity}
                </span>
              </div>
            ))}
            {reports.length === 0 && <p className="text-gray-500 text-sm">No recent detections yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color = "text-mac-blue" }) {
  return (
    <div className="mac-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-mac-gray mb-1 uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
          {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend} this week</p>}
        </div>
        <div className={`p-2 bg-mac-bg rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
