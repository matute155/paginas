import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Trending, ChevronRight, AlertCircle } from 'lucide-react';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import { propertiesAPI, storage, handleApiError } from '../lib/api';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // Load properties on component mount and when filters change
  useEffect(() => {
    loadProperties();
  }, [filters]);

  // Load properties from API
  const loadProperties = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Check if we can use cached data for initial load
      if (Object.keys(newFilters).length === 0 && storage.isCacheValid()) {
        const cached = storage.getCachedProperties();
        if (cached.length > 0) {
          setProperties(cached);
          setFilteredProperties(cached);
          setLoading(false);
        }
      }

      // Prepare API filters
      const apiFilters = {
        page: pagination.page,
        limit: pagination.limit,
        status: 'active',
        ...convertFiltersToAPI(newFilters)
      };

      // Fetch from API
      const response = await propertiesAPI.getAll(apiFilters);
      
      if (response.success) {
        const { data, pagination: paginationData } = response;
        
        setProperties(data);
        setFilteredProperties(data);
        setPagination(paginationData || pagination);

        // Cache data only for initial unfiltered load
        if (Object.keys(newFilters).length === 0) {
          storage.setCachedProperties(data);
        }
      } else {
        throw new Error(response.message || 'Error al cargar propiedades');
      }

    } catch (error) {
      console.error('Error loading properties:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);

      // If there's an error and we have cached data, use it
      if (Object.keys(newFilters).length === 0) {
        const cached = storage.getCachedProperties();
        if (cached.length > 0) {
          setProperties(cached);
          setFilteredProperties(cached);
          setError('Mostrando datos guardados. ' + errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Convert frontend filters to API format
  const convertFiltersToAPI = (frontendFilters) => {
    const apiFilters = {};

    if (frontendFilters.search) {
      apiFilters.search = frontendFilters.search;
    }
    
    if (frontendFilters.area) {
      apiFilters.area = frontendFilters.area;
    }
    
    if (frontendFilters.type) {
      apiFilters.property_type = frontendFilters.type;
    }
    
    if (frontendFilters.guests) {
      apiFilters.capacity = frontendFilters.guests;
    }
    
    if (frontendFilters.minPrice) {
      apiFilters.min_price = frontendFilters.minPrice;
    }
    
    if (frontendFilters.maxPrice) {
      apiFilters.max_price = frontendFilters.maxPrice;
    }

    return apiFilters;
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Retry loading properties
  const retryLoad = () => {
    loadProperties();
  };

  const popularAreas = [
    { name: 'Centro', area: 'centro', properties: properties.filter(p => p.area === 'centro').length },
    { name: 'Villa Krause', area: 'villa_krause', properties: properties.filter(p => p.area === 'villa_krause').length },
    { name: 'Ullúm', area: 'ullum', properties: properties.filter(p => p.area === 'ullum').length },
    { name: 'Rawson', area: 'rawson', properties: properties.filter(p => p.area === 'rawson').length }
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

      {/* Error Message */}
      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
              <button
                onClick={retryLoad}
                className="text-red-600 hover:text-red-800 font-medium mt-2 text-sm"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </section>
      )}

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
                {area.properties} propiedad{area.properties !== 1 ? 'es' : ''}
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
              `${filteredProperties.length} propiedad${filteredProperties.length !== 1 ? 'es' : ''} encontrada${filteredProperties.length !== 1 ? 's' : ''}`
            }
          </h2>
          {filteredProperties.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Trending className="w-4 h-4 mr-2" />
              <span className="text-sm">Ordenado por fecha</span>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={() => {
                    const newPage = pagination.page - 1;
                    setPagination(prev => ({ ...prev, page: newPage }));
                    loadProperties({ ...filters, page: newPage });
                  }}
                  disabled={!pagination.hasPrev}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <span className="text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => {
                    const newPage = pagination.page + 1;
                    setPagination(prev => ({ ...prev, page: newPage }));
                    loadProperties({ ...filters, page: newPage });
                  }}
                  disabled={!pagination.hasNext}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.keys(filters).length > 0 
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Aún no hay propiedades disponibles en la plataforma'
              }
            </p>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => handleFiltersChange({})}
                className="btn-primary"
              >
                Limpiar filtros
              </button>
            )}
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