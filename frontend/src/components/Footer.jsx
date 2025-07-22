import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/564e601e-dd07-435b-8079-d5a3e1df24db/31341e618fcd33261300814e0ec7a19d.png";
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logoUrl} alt="DesdeAca.com San Juan Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold">DesdeAca.com</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Tu plataforma de confianza para encontrar alojamientos únicos en San Juan. 
              Conectamos viajeros con propietarios locales para experiencias auténticas.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <span className="text-lg font-semibold mb-4 block">Enlaces Rápidos</span>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/alojamientos" className="text-gray-300 hover:text-white transition-colors">
                  Alojamientos
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-300 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/testimonios" className="text-gray-300 hover:text-white transition-colors">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link to="/agregar-propiedad" className="text-gray-300 hover:text-white transition-colors">
                  Agregar Propiedad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <span className="text-lg font-semibold mb-4 block">Contacto</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">San Juan, Argentina</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">+54 264 527-0091</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">info@desdeaca.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} DesdeAca.com. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;