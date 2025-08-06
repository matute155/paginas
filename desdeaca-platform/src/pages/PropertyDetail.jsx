import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Waves, 
  Thermometer,
  ChefHat,
  Shirt,
  Flame,
  TreePine,
  PawPrint,
  MessageCircle,
  Calendar,
  Star,
  Shield,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader,
  Home
} from 'lucide-react';
import { propertiesAPI, whatsappAPI, handleApiError } from '../lib/api';
import { SanJuanAreas, Amenities } from '../types';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(null);

  // Load property data on component mount
  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  // Load property from API
  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await propertiesAPI.getById(id);
      
      if (response.success) {
        setProperty(response.data);
        // Set default capacity for guests
        setContactForm(prev => ({
          ...prev,
          guests: Math.min(response.data.capacity, 1)
        }));
      } else {
        throw new Error(response.message || 'Error al cargar la propiedad');
      }

    } catch (error) {
      console.error('Error loading property:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  // Get amenity details
  const getAmenityDetails = (amenity) => {
    const amenityMap = {
      [Amenities.WIFI]: { icon: <Wifi className="w-5 h-5" />, label: 'WiFi' },
      [Amenities.PARKING]: { icon: <Car className="w-5 h-5" />, label: 'Estacionamiento' },
      [Amenities.POOL]: { icon: <Waves className="w-5 h-5" />, label: 'Piscina' },
      [Amenities.AIR_CONDITIONING]: { icon: <Thermometer className="w-5 h-5" />, label: 'Aire acondicionado' },
      [Amenities.HEATING]: { icon: <Thermometer className="w-5 h-5" />, label: 'Calefacción' },
      [Amenities.KITCHEN]: { icon: <ChefHat className="w-5 h-5" />, label: 'Cocina equipada' },
      [Amenities.WASHING_MACHINE]: { icon: <Shirt className="w-5 h-5" />, label: 'Lavarropas' },
      [Amenities.BBQ]: { icon: <Flame className="w-5 h-5" />, label: 'Parrilla' },
      [Amenities.GARDEN]: { icon: <TreePine className="w-5 h-5" />, label: 'Jardín' },
      [Amenities.PETS_ALLOWED]: { icon: <PawPrint className="w-5 h-5" />, label: 'Mascotas permitidas' }
    };
    return amenityMap[amenity] || { icon: null, label: amenity };
  };

  // Handle WhatsApp contact with detailed information
  const handleWhatsAppContact = async () => {
    if (!property || !contactForm.checkIn || !contactForm.checkOut) {
      setContactError('Por favor completa las fechas para contactar al propietario');
      return;
    }

    try {
      setContactLoading(true);
      setContactError(null);

      const contactData = {
        property_id: parseInt(id),
        guest_name: contactForm.guestName || null,
        guest_phone: contactForm.guestPhone || null,
        guest_email: contactForm.guestEmail || null,
        check_in: contactForm.checkIn,
        check_out: contactForm.checkOut,
        guests: contactForm.guests,
        type: 'detailed'
      };

      const response = await whatsappAPI.generateContactLink(contactData);

      if (response.success) {
        // Open WhatsApp
        window.open(response.data.whatsapp_url, '_blank');
      } else {
        throw new Error(response.message || 'Error al generar enlace de WhatsApp');
      }

    } catch (error) {
      console.error('Error generating WhatsApp link:', error);
      const errorMessage = handleApiError(error);
      setContactError(errorMessage);
    } finally {
      setContactLoading(false);
    }
  };

  // Handle quick contact
  const handleQuickContact = async () => {
    if (!property) return;

    try {
      setContactLoading(true);
      setContactError(null);

      const response = await whatsappAPI.generateQuickContactLink(parseInt(id));

      if (response.success) {
        window.open(response.data.whatsapp_url, '_blank');
      } else {
        throw new Error(response.message || 'Error al generar enlace de WhatsApp');
      }

    } catch (error) {
      console.error('Error generating quick WhatsApp link:', error);
      const errorMessage = handleApiError(error);
      setContactError(errorMessage);
    } finally {
      setContactLoading(false);
    }
  };

  // Navigate images
  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  // Retry loading property
  const retryLoad = () => {
    loadProperty();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-sanjuan-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al cargar la propiedad
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button onClick={retryLoad} className="btn-primary">
              Reintentar
            </button>
            <Link to="/" className="btn-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Propiedad no encontrada
          </h2>
          <Link to="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Volver a la búsqueda</span>
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="relative h-96 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';
              }}
            />
            
            {/* Navigation buttons */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Home className="w-16 h-16 mx-auto mb-4" />
              <p>Sin imágenes disponibles</p>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{getAreaDisplayName(property.area)}, San Juan</span>
              </div>
              
              {/* Property specs */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{property.capacity} huéspedes</span>
                </div>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{property.bedrooms} dormitorios</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{property.bathrooms} baños</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descripción
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => {
                    const amenityDetails = getAmenityDetails(amenity);
                    return (
                      <div key={amenity} className="flex items-center space-x-3">
                        <div className="text-gray-600">
                          {amenityDetails.icon}
                        </div>
                        <span className="text-gray-700">
                          {amenityDetails.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* House Rules */}
            {property.rules && property.rules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Normas de la casa
                </h2>
                <ul className="space-y-2">
                  {property.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card p-6">
                {/* Price */}
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${property.price.daily.toLocaleString()}
                    <span className="text-lg font-normal text-gray-600">/noche</span>
                  </div>
                  {(property.price.weekly || property.price.monthly) && (
                    <div className="text-sm text-gray-600">
                      {property.price.weekly && `Semanal: $${property.price.weekly.toLocaleString()}`}
                      {property.price.weekly && property.price.monthly && ' • '}
                      {property.price.monthly && `Mensual: $${property.price.monthly.toLocaleString()}`}
                    </div>
                  )}
                </div>

                {/* Contact Form */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entrada
                      </label>
                      <input
                        type="date"
                        value={contactForm.checkIn}
                        onChange={(e) => setContactForm({...contactForm, checkIn: e.target.value})}
                        className="input-field"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salida
                      </label>
                      <input
                        type="date"
                        value={contactForm.checkOut}
                        onChange={(e) => setContactForm({...contactForm, checkOut: e.target.value})}
                        className="input-field"
                        min={contactForm.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Huéspedes
                      </label>
                      <select
                        value={contactForm.guests}
                        onChange={(e) => setContactForm({...contactForm, guests: parseInt(e.target.value)})}
                        className="input-field"
                      >
                        {Array.from({length: property.capacity}, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} huésped{i + 1 !== 1 ? 'es' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tu nombre (opcional)
                      </label>
                      <input
                        type="text"
                        value={contactForm.guestName}
                        onChange={(e) => setContactForm({...contactForm, guestName: e.target.value})}
                        placeholder="Nombre"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {contactError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">{contactError}</p>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppContact}
                    disabled={contactLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {contactLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <MessageCircle className="w-5 h-5" />
                    )}
                    <span>Consultar disponibilidad</span>
                  </button>
                  
                  <button
                    onClick={handleQuickContact}
                    disabled={contactLoading}
                    className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Consulta rápida</span>
                  </button>
                </div>

                {/* Owner Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {property.owner.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Propietario
                      </p>
                    </div>
                    {property.owner.verified && (
                      <div className="flex items-center text-green-600">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-xs">Verificado</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Tiempo de respuesta: {property.owner.responseTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;