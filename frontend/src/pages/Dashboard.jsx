import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, MapPin, Image as ImageIcon, Activity } from 'lucide-react';

const mockData = [
  { name: 'Longitudinal', count: 120 },
  { name: 'Transverse', count: 98 },
  { name: 'Alligator', count: 45 },
  { name: 'Pothole', count: 67 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Scans" value="1,248" icon={ImageIcon} />
        <StatCard title="Damages Found" value="330" icon={AlertTriangle} trend="+12%" />
        <StatCard title="High Severity" value="45" icon={Activity} color="text-red-500" />
        <StatCard title="Locations Mapped" value="218" icon={MapPin} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mac-card p-6">
          <h2 className="text-sm font-semibold text-mac-gray uppercase mb-6">Damage Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
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
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-black/5 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80`} alt="Road" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pothole detected</p>
                    <p className="text-xs text-mac-gray">Colombo District • 2 hours ago</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">High</span>
              </div>
            ))}
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
