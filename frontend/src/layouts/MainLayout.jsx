import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Map as MapIcon, Settings, LogOut, Video } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Analyze Image', path: '/app/upload', icon: UploadCloud },
    { name: 'Video Analysis', path: '/app/video', icon: Video },
    { name: 'Map View', path: '/app/map', icon: MapIcon },
  ];

  return (
    <div className="flex h-screen w-full bg-mac-bg overflow-hidden">
      {/* macOS Sidebar */}
      <aside className="w-64 bg-mac-surface/60 backdrop-blur-2xl border-r border-mac-border flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500 shadow-sm"></div>
          </div>
          
          <h2 className="text-xs font-semibold text-mac-gray uppercase tracking-wider mb-4 px-2">Menu</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-mac-blue/10 text-mac-blue' 
                      : 'text-gray-600 hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
           <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-black/5 transition-colors"
           >
              <LogOut className="w-4 h-4" />
              Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-mac-bg">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
