import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Search, Plus } from 'lucide-react';

const Header = ({ user, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sanjuan-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Desde<span className="text-sanjuan-500">Aca</span>.com
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-sanjuan-500' 
                  : 'text-gray-600 hover:text-sanjuan-500'
              }`}
            >
              Buscar
            </Link>
            {user ? (
              <>
                {user.type === 'owner' && (
                  <Link
                    to="/dashboard"
                    className={`font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'text-sanjuan-500' 
                        : 'text-gray-600 hover:text-sanjuan-500'
                    }`}
                  >
                    Mi Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Hola, {user.name}
                  </span>
                  <button
                    onClick={onAuthClick}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={onAuthClick}
                  className="text-gray-600 hover:text-sanjuan-500 font-medium"
                >
                  Iniciar Sesión
                </button>
                <Link
                  to="/register"
                  className="btn-sanjuan"
                >
                  Publicar Propiedad
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-sanjuan-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </Link>
              {user ? (
                <>
                  {user.type === 'owner' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 text-gray-600 hover:text-sanjuan-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Mi Dashboard</span>
                    </Link>
                  )}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">
                      Hola, {user.name}
                    </p>
                    <button
                      onClick={() => {
                        onAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      onAuthClick();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-sanjuan-500"
                  >
                    Iniciar Sesión
                  </button>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 text-sanjuan-500 hover:text-sanjuan-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Publicar Propiedad</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;