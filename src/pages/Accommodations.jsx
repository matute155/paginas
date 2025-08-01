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
    priceRange: [0, 200000],
    propertyType: '',
    amenities: [],
    ...(searchParams || {}),
  }));

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // ✅ Cambia a ruta relativa (usará tu API en Vercel)
        const res = await axios.get('/api/properties');
        
        const normalized = res.data
          .filter(p => p.status === 'aprobado')
          .map(p => ({
            ...p,
            amenities: Array.isArray(p.amenities)
              ? p.amenities
              : typeof p.amenities === 'string'
                ? p.amenities.split(',').map(a => a.trim())
                : []
          }));

        setProperties(normalized);

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
      } catch (err) {
        console.error("Error al cargar propiedades:", err);
        setError("Error al cargar los alojamientos. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

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

  if (loading) {
    return <div className="flex justify-center pt-20">Cargando alojamientos...</div>;
  }

  if (error) {
    return <div className="flex justify-center pt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* ... el resto del JSX permanece igual ... */}
    </div>
  );
};

export default Accommodations;