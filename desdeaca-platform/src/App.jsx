import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  // Mock user state - replace with actual authentication
  const [user, setUser] = useState(null);

  // Mock authentication handler
  const handleAuth = () => {
    if (user) {
      setUser(null); // Logout
    } else {
      // Mock login - replace with actual authentication
      setUser({
        id: '1',
        name: 'Usuario Demo',
        email: 'demo@desdeaca.com',
        type: 'guest', // or 'owner'
        verified: true
      });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onAuthClick={handleAuth} />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-sanjuan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">D</span>
                  </div>
                  <span className="text-xl font-bold">
                    Desde<span className="text-sanjuan-400">Aca</span>.com
                  </span>
                </div>
                <p className="text-gray-300 mb-4 max-w-md">
                  La plataforma líder en alquileres temporarios de San Juan. 
                  Conectamos viajeros con propiedades únicas en la provincia más hermosa de Argentina.
                </p>
                <div className="text-sm text-gray-400">
                  <p>San Juan, Argentina</p>
                  <p>contacto@desdeaca.com</p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/" className="hover:text-white transition-colors">Buscar propiedades</a></li>
                  <li><a href="/register" className="hover:text-white transition-colors">Publicar propiedad</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>

              {/* Zones */}
              <div>
                <h3 className="font-semibold mb-4">Zonas populares</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="/?area=centro" className="hover:text-white transition-colors">Centro</a></li>
                  <li><a href="/?area=villa_krause" className="hover:text-white transition-colors">Villa Krause</a></li>
                  <li><a href="/?area=ullum" className="hover:text-white transition-colors">Ullúm</a></li>
                  <li><a href="/?area=rawson" className="hover:text-white transition-colors">Rawson</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 DesdeAca.com. Todos los derechos reservados.</p>
              <p className="text-sm mt-2">
                Hecho con ❤️ en San Juan, Argentina
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
