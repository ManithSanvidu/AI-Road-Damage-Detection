import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, MapPin, Image as ImageIcon, Activity, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    highSeverity: 0,
    longitudinal: 0,
    transverse: 0,
    alligator: 0,
    pothole: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('https://ai-road-damage-detection-q6sv.onrender.com/reports');
        if (response.ok) {
          const data = await response.json();
          setReports(data);
          
          let high = 0, long = 0, trans = 0, alli = 0, pot = 0, res = 0;
          
          data.forEach(r => {
            if (r.severity === 'High' || r.severity === 'Critical') high++;
            if (r.damage_type === 'Longitudinal') long++;
            if (r.damage_type === 'Transverse') trans++;
            if (r.damage_type === 'Alligator') alli++;
            if (r.damage_type === 'Pothole') pot++;
            if (r.status === 'Resolved') res++;
          });
          
          setStats({
            total: data.length,
            highSeverity: high,
            longitudinal: long,
            transverse: trans,
            alligator: alli,
            pothole: pot,
            resolved: res
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

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`https://ai-road-damage-detection-q6sv.onrender.com/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = [
    { name: 'Longitudinal', count: stats.longitudinal },
    { name: 'Transverse', count: stats.transverse },
    { name: 'Alligator', count: stats.alligator },
    { name: 'Pothole', count: stats.pothole },
  ];

  const severityWeight = { "Critical": 40, "High": 30, "Medium": 20, "Low": 10 };
  
  const sortedReports = [...reports].sort((a, b) => {
    if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
    if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
    return (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Damages Mapped" value={stats.total} icon={MapPin} color="text-mac-blue" />
        <StatCard title="High Priority" value={stats.highSeverity} icon={AlertTriangle} color="text-red-500" />
        <StatCard title="Repairs Resolved" value={stats.resolved} icon={CheckCircle} color="text-green-500" />
        <StatCard title="Total Scans" value="1,248" icon={Activity} />
      </div>

      {/* Chart & Action Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        
        <div className="mac-card p-6 xl:col-span-1">
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
        
        <div className="mac-card p-6 xl:col-span-2">
          <h2 className="text-sm font-semibold text-mac-gray uppercase mb-6">Maintenance Action Table (Prioritised)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Defect Type</th>
                  <th className="px-4 py-3">AI-Assessed Severity</th>
                  <th className="px-4 py-3">Location (District)</th>
                  <th className="px-4 py-3 rounded-tr-lg">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedReports.slice(0, 8).map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.damage_type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.severity === 'High' || r.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                        r.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.description && r.description.startsWith('[') 
                        ? r.description.split(']')[0] + ']' 
                        : (r.latitude ? `${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}` : 'N/A')}
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={r.status || 'Reported'}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 border rounded outline-none ${
                          r.status === 'Resolved' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100'
                        }`}
                      >
                        <option value="Reported">Reported</option>
                        <option value="Verified">Verified</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedReports.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center">No damages reported yet.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-mac-blue" }) {
  return (
    <div className="mac-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-mac-gray mb-1 uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
        <div className={`p-2 bg-mac-bg rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
