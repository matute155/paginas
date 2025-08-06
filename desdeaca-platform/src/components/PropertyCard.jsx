import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Bed, Bath, Wifi, Car, Waves, MessageCircle, Home } from 'lucide-react';
import { SanJuanAreas, Amenities } from '../types';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    area,
    images,
    price,
    capacity,
    bedrooms,
    bathrooms,
    amenities,
    type
  } = property;

  // Get area display name
  const getAreaDisplayName = (areaKey) => {
    const areaNames = {
      [SanJuanAreas.CENTRO]: 'Centro',
      [SanJuanAreas.VILLA_KRAUSE]: 'Villa Krause',
      [SanJuanAreas.CHIMBAS]: 'Chimbas',
      [SanJuanAreas.RAWSON]: 'Rawson',
      [SanJuanAreas.POCITO]: 'Pocito',
      [SanJuanAreas.SANTA_LUCIA]: 'Santa Lucía',
      [SanJuanAreas.ULLUM]: 'Ullúm',
      [SanJuanAreas.ZONDA]: 'Zonda',
      [SanJuanAreas.CAUCETE]: 'Caucete',
      [SanJuanAreas.RIVADAVIA]: 'Rivadavia'
    };
    return areaNames[areaKey] || areaKey;
  };

  // Get property type display name
  const getTypeDisplayName = (typeKey) => {
    const typeNames = {
      house: 'Casa',
      apartment: 'Departamento',
      cabin: 'Cabaña',
      studio: 'Estudio'
    };
    return typeNames[typeKey] || typeKey;
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const icons = {
      [Amenities.WIFI]: <Wifi className="w-4 h-4" />,
      [Amenities.PARKING]: <Car className="w-4 h-4" />,
      [Amenities.POOL]: <Waves className="w-4 h-4" />
    };
    return icons[amenity] || null;
  };

  // Show first 3 amenities
  const displayAmenities = amenities?.slice(0, 3) || [];

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Home className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Sin imagen</p>
            </div>
          </div>
        )}
        
        {/* Property type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-sanjuan-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {getTypeDisplayName(type)}
          </span>
        </div>

        {/* Images count */}
        {images && images.length > 1 && (
          <div className="absolute top-3 right-3">
            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              +{images.length - 1}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and location */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{getAreaDisplayName(area)}, San Juan</span>
          </div>
        </div>

        {/* Property details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{capacity} huésp{capacity !== 1 ? 'edes' : 'ed'}</span>
          </div>
          {bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{bedrooms} dorm</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{bathrooms} baño{bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {displayAmenities.length > 0 && (
          <div className="flex items-center space-x-2 mb-3">
            {displayAmenities.map((amenity) => {
              const icon = getAmenityIcon(amenity);
              return icon ? (
                <div key={amenity} className="text-gray-400">
                  {icon}
                </div>
              ) : null;
            })}
            {amenities && amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{amenities.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Price and actions */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            ${price?.daily?.toLocaleString()}
            <span className="text-sm font-normal text-gray-600">/noche</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to={`/property/${id}`}
              className="btn-primary text-sm"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;