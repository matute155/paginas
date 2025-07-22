
import { motion } from 'framer-motion';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Accommodations = () => {
  const location = useLocation();
  const searchParams = location.state;
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(() => ({
  priceRange: [0, 20000],
  propertyType: '',
  amenities: [],
  ...(searchParams || {}) // Si vienen datos de Home, los usa como base
}));



const [properties, setProperties] = useState([]);
const [filteredProperties, setFilteredProperties] = useState([]);

useEffect(() => {
  axios.get('http://localhost:3001/api/properties')
  .then(res => {
    const normalized = res.data
      .filter(p => p.status === 'aprobado') // ✅ Solo propiedades aprobadas
      .map(p => ({
        ...p,
        amenities: Array.isArray(p.amenities)
          ? p.amenities
          : typeof p.amenities === 'string'
            ? p.amenities.split(',').map(a => a.trim())
            : []
      }));
    setProperties(normalized);


      // Aplicar filtro inicial si viene desde Home
      if (searchParams) {
        const { location, guests, fromDate, toDate } = searchParams;

        const filtered = normalized.filter((property) => {
          const matchLocation = location ? property.location.includes(location) : true;
          const matchGuests = guests ? property.capacity >= guests : true;

          const availableFrom = property.availableFrom || '2000-01-01';
          const availableTo = property.availableTo || '2100-01-01';

          const matchFromDate = fromDate ? fromDate >= availableFrom : true;
          const matchToDate = toDate ? toDate <= availableTo : true;

          return matchLocation && matchGuests && matchFromDate && matchToDate;
        });

        setFilteredProperties(filtered);
      } else {
        setFilteredProperties(normalized);
      }
    })
    .catch(err => console.error("Error al cargar propiedades:", err));
}, []);


useEffect(() => {
  const filtered = properties.filter((property) => {
    const matchPrice = property.price <= filters.priceRange[1];
    const matchType = filters.propertyType
      ? property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
      : true;
    const matchAmenities = filters.amenities.every(a =>
      property.amenities.includes(a)
    );
    return matchPrice && matchType && matchAmenities;
  });

  setFilteredProperties(filtered);
}, [filters, properties]);


const handleSearch = (searchData) => {
  const { location, guests, fromDate, toDate } = searchData;

  const filtered = properties.filter((property) => {
    const matchLocation = location ? property.location.includes(location) : true;
    const matchGuests = guests ? property.capacity >= guests : true;

    const availableFrom = property.availableFrom || '2000-01-01';
    const availableTo = property.availableTo || '2100-01-01';

    const matchFromDate = fromDate ? fromDate >= availableFrom : true;
    const matchToDate = toDate ? toDate <= availableTo : true;

    return matchLocation && matchGuests && matchFromDate && matchToDate;
  });

  setFilteredProperties(filtered);
};

useEffect(() => {
  if (searchParams) {
    handleSearch(searchParams);
  }
}, []);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Alojamientos en San Juan
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Encuentra el lugar perfecto para tu estadía
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SearchForm onSearch={handleSearch} defaultValues={filters} />

          </motion.div>
        </div>
      </section>

      {/* Filtros y Vista */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
              <span className="text-gray-600">
                {properties.length} alojamientos encontrados
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Panel de Filtros */}
{showFilters && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="mt-6 p-6 bg-gray-50 rounded-lg"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rango de Precio
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="200000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [0, parseInt(e.target.value)]
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)}


        </div>
      </section>

      {/* Lista de Propiedades */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property, index) => (

              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline">Anterior</Button>
              <Button>1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Siguiente</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accommodations;
