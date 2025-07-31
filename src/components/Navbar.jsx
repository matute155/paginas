import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, Building, Phone, Users, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLoginModal from '@/components/AdminLoginModal'; 



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/564e601e-dd07-435b-8079-d5a3e1df24db/31341e618fcd33261300814e0ec7a19d.png";

  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Alojamientos', path: '/alojamientos', icon: Building },
    { name: 'Nosotros', path: '/nosotros', icon: Users },
    { name: 'Testimonios', path: '/testimonios', icon: MessageSquare },
    { name: 'Contacto', path: '/contacto', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <img src={logoUrl} alt="DesdeAca.com San Juan Logo" className="w-10 h-10" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">DesdeAca.com</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Link to="/agregar-propiedad">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Propiedad
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => setShowAdminModal(true)}
              className="text-orange-700 border-orange-300 hover:bg-orange-50">
              Acceso Admin
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6 text-orange-700" /> : <Menu className="w-6 h-6 text-orange-700" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white rounded-lg shadow-lg mt-2 p-4"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/agregar-propiedad"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Agregar Propiedad</span>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
              setIsOpen(false);
              setShowAdminModal(true);
              }}
              className="w-full mt-2 text-orange-700 border-orange-300 hover:bg-orange-50"
            > 
              Acceso Admin
            </Button>

          </motion.div>
        )}
      </div>
      {showAdminModal && (
        <AdminLoginModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onLogin={() => setIsAuthenticated(true)}
       />
    )}
    </nav>
  );
};

export default Navbar;