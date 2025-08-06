import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Filter, X } from 'lucide-react';
import { SanJuanAreas, PropertyTypes } from '../types';

const SearchFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    area: '',
    type: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: '',
    maxPrice: '',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      area: '',
      type: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Get area options
  const getAreaOptions = () => {
    return [
      { value: '', label: 'Todas las zonas' },
      { value: SanJuanAreas.CENTRO, label: 'Centro' },
      { value: SanJuanAreas.VILLA_KRAUSE, label: 'Villa Krause' },
      { value: SanJuanAreas.CHIMBAS, label: 'Chimbas' },
      { value: SanJuanAreas.RAWSON, label: 'Rawson' },
      { value: SanJuanAreas.POCITO, label: 'Pocito' },
      { value: SanJuanAreas.SANTA_LUCIA, label: 'Santa Lucía' },
      { value: SanJuanAreas.ULLUM, label: 'Ullúm' },
      { value: SanJuanAreas.ZONDA, label: 'Zonda' },
      { value: SanJuanAreas.CAUCETE, label: 'Caucete' },
      { value: SanJuanAreas.RIVADAVIA, label: 'Rivadavia' }
    ];
  };

  // Get property type options
  const getTypeOptions = () => {
    return [
      { value: '', label: 'Todos los tipos' },
      { value: PropertyTypes.HOUSE, label: 'Casa' },
      { value: PropertyTypes.APARTMENT, label: 'Departamento' },
      { value: PropertyTypes.CABIN, label: 'Cabaña' },
      { value: PropertyTypes.STUDIO, label: 'Estudio' }
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      {/* Main search bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Location */}
        <div className="lg:w-64 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filters.area}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            className="input-field pl-10 appearance-none bg-white"
          >
            {getAreaOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div className="lg:w-48 relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filters.guests}
            onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
            className="input-field pl-10 appearance-none bg-white"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>
                {num} huésped{num !== 1 ? 'es' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="lg:w-auto btn-secondary flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Property type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de propiedad
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input-field"
              >
                {getTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de entrada
              </label>
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Check-out date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de salida
              </label>
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                className="input-field"
                min={filters.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Price range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio por noche
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Clear filters */}
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;