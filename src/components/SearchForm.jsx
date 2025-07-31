
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    fromDate: '',
    toDate: '',
    guests: 1
  });


  const locations = [
    'Capital',
    'Rivadavia',
    'Chimbas',
    'Rawson',
    'Pocito',
    'Santa Lucía',
    'Albardón',
    'Angaco',
    'Calingasta',
    'Caucete'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Ubicación */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            Ubicación
          </label>
          <select
            value={searchData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar zona</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Check-in */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            name="fromDate"
            value={searchData.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            name="toDate"
            value={searchData.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>


        {/* Huéspedes */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            Huéspedes
          </label>
          <select
            value={searchData.guests}
            onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'huésped' : 'huéspedes'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4"
        >
          <Search className="w-5 h-5 mr-2" />
          Buscar Alojamientos
        </Button>
      </div>
    </motion.form>
  );
};

export default SearchForm;
