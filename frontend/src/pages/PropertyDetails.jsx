import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL;

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-[22rem] md:h-[28rem] rounded-xl overflow-hidden shadow-xl mb-8">
      <img
        src={`${API_URL}${images[current]}`}
        alt={`Foto ${current + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full backdrop-blur-md shadow-md transition"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full backdrop-blur-md shadow-md transition"
      >
        ›
      </button>
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              current === i ? 'bg-white scale-110 shadow-md' : 'bg-white/50'
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error("Error al cargar propiedad:", err));
  }, [id]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReservation = () => {
    const phone = property.phone?.replace(/\D/g, '');
    if (!phone) {
      toast({
        title: 'Número no disponible',
        description: 'No se encontró un número válido para contactar al anfitrión.',
        variant: 'destructive'
      });
      return;
    }

    const message = encodeURIComponent(
      `Hola! Estoy interesado en reservar la propiedad "${property.title}" en DesdeAca.com para ${formData.guests} personas, del ${formData.checkIn} al ${formData.checkOut}.`
    );

    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  };

  if (!property) return <div className="p-6 text-center text-gray-600">Cargando propiedad...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pt-20">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <p className="text-gray-500">{property.location}</p>
          <p className="text-2xl text-blue-700 font-semibold mb-6">${property.price} / noche</p>

          {Array.isArray(property.image) && property.image.length > 0 && (
            <ImageSlider images={property.image} />
          )}

          <div className="space-y-3 text-gray-700 text-base leading-relaxed">
            <p><strong>Capacidad:</strong> {property.capacity} personas</p>
            <p><strong>Amenidades:</strong> {Array.isArray(property.amenities)
              ? property.amenities.join(', ')
              : String(property.amenities || '')}</p>
            <p><strong>Descripción:</strong> {property.description || 'Sin descripción.'}</p>
            {property.address && <p><strong>Dirección:</strong> {property.address}</p>}
            {property.phone && <p><strong>Teléfono:</strong> {property.phone}</p>}
            {property.contactEmail && <p><strong>Correo:</strong> {property.contactEmail}</p>}
            {property.hostName && <p><strong>Anfitrión:</strong> {property.hostName}</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Reservar</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Tu correo"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="number"
              name="guests"
              min={1}
              value={formData.guests}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleReservation}
              className="w-full py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition shadow"
            >
              Contactar por WhatsApp
            </button>

            {property.hostName && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 space-y-1 text-sm">
                <p><strong>Anfitrión:</strong> {property.hostName}</p>
                {property.phone && <p><strong>Teléfono:</strong> {property.phone}</p>}
                {property.contactEmail && <p><strong>Email:</strong> {property.contactEmail}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
