import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Trending, ChevronRight } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  // Mock data for development - replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProperties = [
        {
          id: '1',
          title: 'Casa amplia con quincho en Villa Krause',
          description: 'Hermosa casa familiar con piscina y parrilla',
          type: 'house',
          area: 'villa_krause',
          address: 'Villa Krause, San Juan',
          coordinates: { lat: -31.5375, lng: -68.5364 },
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500',
            'https://images.unsplash.com/photo-1502005229762-cf1b2da16c06?w=500'
          ],
          amenities: ['wifi', 'parking', 'pool', 'bbq', 'air_conditioning'],
          capacity: 8,
          bedrooms: 3,
          bathrooms: 2,
          price: {
            daily: 15000,
            weekly: 90000,
            monthly: 350000
          },
          ownerId: 'owner1',
          ownerPhone: '2644123456',
          status: 'active'
        },
        {
          id: '2',
          title: 'Departamento moderno en el Centro',
          description: 'Departamento completamente equipado en zona céntrica',
          type: 'apartment',
          area: 'centro',
          address: 'Centro, San Juan',
          coordinates: { lat: -31.5375, lng: -68.5364 },
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
          ],
          amenities: ['wifi', 'air_conditioning', 'heating'],
          capacity: 4,
          bedrooms: 2,
          bathrooms: 1,
          price: {
            daily: 8000,
            weekly: 50000,
            monthly: 180000
          },
          ownerId: 'owner2',
          ownerPhone: '2644654321',
          status: 'active'
        },
        {
          id: '3',
          title: 'Cabaña en Ullúm con vista al dique',
          description: 'Escapada perfecta con vista panorámica al dique',
          type: 'cabin',
          area: 'ullum',
          address: 'Ullúm, San Juan',
          coordinates: { lat: -31.4167, lng: -68.6667 },
          images: [
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'
          ],
          amenities: ['wifi', 'parking', 'bbq', 'garden'],
          capacity: 6,
          bedrooms: 2,
          bathrooms: 1,
          price: {
            daily: 12000,
            weekly: 75000,
            monthly: 280000
          },
          ownerId: 'owner3',
          ownerPhone: '2644789012',
          status: 'active'
        }
      ];
      
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...properties];
    
    // Apply search filter
    if (newFilters.search) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        property.description.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }
    
    // Apply area filter
    if (newFilters.area) {
      filtered = filtered.filter(property => property.area === newFilters.area);
    }
    
    // Apply type filter
    if (newFilters.type) {
      filtered = filtered.filter(property => property.type === newFilters.type);
    }
    
    // Apply capacity filter
    if (newFilters.guests) {
      filtered = filtered.filter(property => property.capacity >= newFilters.guests);
    }
    
    // Apply price filter
    if (newFilters.minPrice) {
      filtered = filtered.filter(property => property.price.daily >= parseInt(newFilters.minPrice));
    }
    if (newFilters.maxPrice) {
      filtered = filtered.filter(property => property.price.daily <= parseInt(newFilters.maxPrice));
    }
    
    setFilteredProperties(filtered);
  };

  const popularAreas = [
    { name: 'Centro', area: 'centro', properties: 12 },
    { name: 'Villa Krause', area: 'villa_krause', properties: 8 },
    { name: 'Ullúm', area: 'ullum', properties: 6 },
    { name: 'Rawson', area: 'rawson', properties: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-sanjuan-600 to-sanjuan-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Descubrí San Juan
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Encontrá el alojamiento perfecto para tu estadía en la provincia más hermosa de Argentina
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                <span>San Juan, Argentina</span>
              </div>
              <div className="flex items-center text-lg">
                <Star className="w-5 h-5 mr-2" />
                <span>Propiedades verificadas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <SearchFilters onFiltersChange={handleFiltersChange} />
      </section>

      {/* Popular Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Zonas populares
          </h2>
          <button className="flex items-center text-sanjuan-600 hover:text-sanjuan-700 font-medium">
            Ver todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularAreas.map((area) => (
            <button
              key={area.area}
              onClick={() => handleFiltersChange({ ...filters, area: area.area })}
              className="card hover:shadow-lg transition-shadow duration-300 p-6 text-center"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {area.name}
              </h3>
              <p className="text-gray-600">
                {area.properties} propiedades
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {filteredProperties.length === properties.length ? 
              'Propiedades destacadas' : 
              `${filteredProperties.length} propiedades encontradas`
            }
          </h2>
          {filteredProperties.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Trending className="w-4 h-4 mr-2" />
              <span className="text-sm">Ordenado por relevancia</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4 w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <button
              onClick={() => handleFiltersChange({})}
              className="btn-primary"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-sanjuan-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Tenés una propiedad en San Juan?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Publicá tu casa, departamento o cabaña y comenzá a recibir huéspedes hoy mismo
          </p>
          <Link
            to="/register"
            className="btn-sanjuan text-lg px-8 py-3"
          >
            Publicar mi propiedad
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;