import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
        <div className="pt-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-mac-blue flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold tracking-tight text-gray-900">RoadAI</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="w-full max-w-sm mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
              <p className="mt-2 text-gray-500">Start detecting road damages in minutes.</p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mac-blue/20 focus:border-mac-blue transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mac-blue/20 focus:border-mac-blue transition-all"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mac-blue/20 focus:border-mac-blue transition-all"
                  placeholder="Create a strong password"
                />
              </div>
              
              <div>
                <label htmlFor="org" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Organization / Municipality
                </label>
                <input
                  id="org"
                  name="org"
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mac-blue/20 focus:border-mac-blue transition-all"
                  placeholder="Optional"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 mt-2 rounded-xl bg-mac-blue text-white font-medium hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Create account
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-mac-blue hover:text-blue-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1500&q=80" 
          alt="Road driving view" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
          <div className="space-y-4 max-w-lg">
            <h3 className="text-3xl font-bold leading-tight">Map your roads with AI precision.</h3>
            <p className="text-gray-300 text-lg">
              Join hundreds of municipalities using AI to keep their citizens safe and optimize infrastructure spending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
