import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, ArrowRight, Target, Map as MapIcon, BarChart3, UploadCloud, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-mac-blue flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">RoadAI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors ml-4">
              Log in
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Side by Side) */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
                Next-Gen Infrastructure Intelligence
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 mb-6 leading-[1.1]">
                Intelligent road damage detection <span className="text-transparent bg-clip-text bg-gradient-to-r from-mac-blue to-indigo-500">powered by AI</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Automatically identify, classify, and map potholes and cracks using state-of-the-art computer vision. Ensure safer roads and optimized maintenance scheduling for your municipality.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-mac-blue text-white text-base font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Start Analyzing <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-900 text-base font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80" 
                alt="Road Network" 
                className="w-full h-full object-cover"
              />
              {/* Mock Floating Element */}
              <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/95 backdrop-blur p-5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">High Severity</p>
                  <p className="text-xs font-medium text-gray-500">Pothole detected • 98% confidence</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-mac-blue uppercase mb-3">Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">How RoadAI works</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-mac-blue flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">1. Upload Images</h4>
              <p className="text-gray-600 leading-relaxed">
                Upload street-level imagery from smartphones, dashcams, or municipal vehicles into our secure dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">2. AI Detection</h4>
              <p className="text-gray-600 leading-relaxed">
                Our custom YOLOv11 model instantly detects damages and classifies their severity from Low to High.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                <MapIcon className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">3. Map & Repair</h4>
              <p className="text-gray-600 leading-relaxed">
                Damages are automatically pinned to a GIS map, helping you prioritize maintenance based on severity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Section with Images */}
      <div id="features" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:flex md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest text-mac-blue uppercase mb-3">Capabilities</h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">Everything you need to maintain perfect roads.</h3>
              <p className="text-lg text-gray-600">A comprehensive suite of tools built specifically for modern civil engineering and smart city management.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 w-full overflow-hidden bg-gray-200">
                <img src="https://plus.unsplash.com/premium_photo-1749040967110-62a002bb39ae?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cracked road" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <Layers className="w-8 h-8 text-mac-blue mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Multi-Class Detection</h4>
                <p className="text-gray-600">Accurately identify longitudinal cracks, transverse cracks, alligator cracks, and potholes in varying lighting conditions.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 w-full overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1544819679-57b273c027a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Road repair budget allocation" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <Activity className="w-8 h-8 text-mac-blue mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Severity Scoring</h4>
                <p className="text-gray-600">Our secondary ML model calculates damage severity to help you allocate repair budgets efficiently and effectively.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 w-full overflow-hidden bg-gray-200">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Data dashboard" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <BarChart3 className="w-8 h-8 text-mac-blue mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h4>
                <p className="text-gray-600">View beautiful, interactive charts detailing damage distributions across your entire city network.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Break / Image Banner */}
      <div className="h-[400px] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80" 
          alt="Scenic empty road" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              Building the future of transportation.
            </h2>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to upgrade your road maintenance?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join forward-thinking municipalities using AI to keep their infrastructure safe, efficient, and cost-effective.</p>
          <Link to="/register" className="inline-flex px-8 py-4 rounded-full bg-gray-900 text-white text-lg font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-mac-blue flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">RoadAI</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Next-generation infrastructure intelligence. Empowering cities to maintain safer roads through artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Detection Accuracy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} RoadAI Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
