import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center py-20">
          <div className="animate-fade-in">
            <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
              Premium Real Estate Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 font-outfit">
              Find Your <span className="text-blue-600">Dream Home</span> in Kenya
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Experience the future of property management. Buy, rent, and manage estates with ease through our secure and modern platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/buy')}
                className="btn-premium"
              >
                Browse Properties
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button 
                onClick={() => navigate('/agent')}
                className="btn-outline-premium"
              >
                List Property
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
              <div>
                <p className="text-2xl font-bold text-gray-900 font-outfit">2.5k+</p>
                <p className="text-sm text-gray-500">Listed Properties</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900 font-outfit">1.2k+</p>
                <p className="text-sm text-gray-500">Happy Clients</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop" 
                alt="Modern Mansion" 
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-800">Joined by 100+ agents this week</p>
                </div>
              </div>
            </div>
            {/* Floating Element */}
            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-3xl shadow-xl border border-white/40 hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-2xl text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 font-outfit">Secure Payments</p>
                  <p className="text-xs text-gray-500">M-Pesa Integrated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-outfit">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Get your dream property in three simple steps. We make the process seamless and transparent.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Find Property', desc: 'Browse our extensive catalog of quality properties in prime locations.', step: '01' },
              { title: 'Secure Payment', desc: 'Pay securely via M-Pesa. Instant confirmation and receipting.', step: '02' },
              { title: 'Move In', desc: 'Complete the process and get the keys to your new home.', step: '03' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
                <span className="text-4xl font-bold text-blue-100 group-hover:text-blue-600 transition-colors duration-300 font-outfit">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3 font-outfit">{item.title}</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EstateEmpire
              </h2>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a>
            </div>
            <p className="text-sm text-gray-400">© 2025 EstateEmpire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
