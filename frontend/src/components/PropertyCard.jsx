import { Link } from 'react-router-dom';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Wifi, Car, Coffee, Tv, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '../api'; // ✅ Importamos la base URL del backend

const PropertyCard = ({ property }) => {
  const getAmenityIcon = (amenity) => {
    const icons = {
      'Wifi': Wifi,
      'Estacionamiento': Car,
      'Cocina': Coffee,
      'TV': Tv,
      'Piscina': Waves,
      'Balcón': MapPin,
      'Parrilla': Coffee
    };
    const Icon = icons[amenity] || Coffee;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden">
        <img  
          className="w-full h-full object-cover"
          alt={`${property.title} - Alojamiento en ${property.location}`}
          src={
  property.image?.[0]
    ? `${import.meta.env.VITE_API_URL}${property.image[0]}`
    : '/placeholder.jpg'
}

        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold">{property.rating}</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {property.title}
          </h3>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <Users className="w-4 h-4 mr-1" />
          <span className="text-sm">Hasta {property.capacity} huéspedes</span>
          <span className="mx-2">•</span>
          <span className="text-sm">{property.reviews} reseñas</span>
        </div>

        {/* Amenidades */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 4).map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1"
            >
              {getAmenityIcon(amenity)}
              <span className="text-xs text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>

        {/* Precio y botón */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm"> / noche</span>
          </div>
          <Link to={`/propiedad/${property.id}`}>
            <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Ver Detalles
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
