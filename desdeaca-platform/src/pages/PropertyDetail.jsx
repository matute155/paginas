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
  ChevronRight
} from 'lucide-react';
import { generateWhatsAppLink, generateQuickContactLink } from '../lib/whatsapp';
import { SanJuanAreas, Amenities } from '../types';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    guestName: ''
  });

  // Mock data - replace with API call
  useEffect(() => {
    setTimeout(() => {
      const mockProperty = {
        id: '1',
        title: 'Casa amplia con quincho en Villa Krause',
        description: 'Hermosa casa familiar perfecta para familias y grupos de amigos. Cuenta con una amplia piscina, quincho equipado con parrilla, y todos los amenities necesarios para una estadía inolvidable en San Juan. La propiedad está ubicada en una zona tranquila y segura, a pocos minutos del centro de la ciudad y cerca de los principales atractivos turísticos.',
        type: 'house',
        area: 'villa_krause',
        address: 'Villa Krause, San Juan',
        coordinates: { lat: -31.5375, lng: -68.5364 },
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da16c06?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
        ],
        amenities: ['wifi', 'parking', 'pool', 'bbq', 'air_conditioning', 'kitchen', 'washing_machine', 'garden'],
        capacity: 8,
        bedrooms: 3,
        bathrooms: 2,
        price: {
          daily: 15000,
          weekly: 90000,
          monthly: 350000
        },
        owner: {
          id: 'owner1',
          name: 'María González',
          phone: '2644123456',
          verified: true,
          responseTime: '2 horas'
        },
        status: 'active',
        rules: [
          'No fumar en el interior',
          'Mascotas permitidas con consulta previa',
          'Horario de silencio: 22:00 - 08:00',
          'Check-in: 15:00 - 20:00',
          'Check-out: 11:00'
        ]
      };
      
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [id]);

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

  // Handle WhatsApp contact
  const handleWhatsAppContact = () => {
    if (!property || !contactForm.checkIn || !contactForm.checkOut) {
      alert('Por favor completa las fechas para contactar al propietario');
      return;
    }

    const whatsappUrl = generateWhatsAppLink({
      ownerPhone: property.owner.phone,
      propertyTitle: property.title,
      checkIn: new Date(contactForm.checkIn),
      checkOut: new Date(contactForm.checkOut),
      guestName: contactForm.guestName,
      guests: contactForm.guests
    });

    window.open(whatsappUrl, '_blank');
  };

  // Handle quick contact
  const handleQuickContact = () => {
    if (!property) return;

    const whatsappUrl = generateQuickContactLink(
      property.owner.phone,
      property.title
    );

    window.open(whatsappUrl, '_blank');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
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
        {property.images && property.images.length > 0 && (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
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
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
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

            {/* House Rules */}
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
                  <div className="text-sm text-gray-600">
                    Semanal: ${property.price.weekly.toLocaleString()} • 
                    Mensual: ${property.price.monthly.toLocaleString()}
                  </div>
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

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Consultar disponibilidad</span>
                  </button>
                  
                  <button
                    onClick={handleQuickContact}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
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