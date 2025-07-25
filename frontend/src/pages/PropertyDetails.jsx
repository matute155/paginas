// src/pages/PropertyDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const prevSlide = () => setCurrent(i => i === 0 ? images.length - 1 : i - 1);
  const nextSlide = () => setCurrent(i => i === images.length - 1 ? 0 : i + 1);

  return (
    <div className="relative w-full h-[22rem] md:h-[28rem] rounded-xl overflow-hidden shadow-xl mb-8">
      <img
        src={images[current]}
        alt={`Foto ${current + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md">
        ‹
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md">
        ›
      </button>
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full cursor-pointer ${current === i ? 'bg-white scale-110 shadow-md' : 'bg-white/50'}`}
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
    name: '', email: '', checkIn: '', checkOut: '', guests: 1
  });

  useEffect(() => {
    // Petición a ruta relativa para evitar CORS
    axios.get(`/api/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(err => console.error("Error al cargar propiedad:", err));
  }, [id]);

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReservation = () => {
    const phone = property.phone?.replace(/\D/g, '');
    if (!phone) {
      return toast({
        title: 'Número no disponible',
        description: 'No se encontró un número válido para contactar al anfitrión.',
        variant: 'destructive'
      });
    }
    const msg = encodeURIComponent(
      `Hola! Estoy interesado en reservar "${property.title}" para ${formData.guests} personas del ${formData.checkIn} al ${formData.checkOut}.`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  if (!property) {
    return <div className="p-6 text-center text-gray-600">Cargando propiedad...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pt-20">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
          <p className="text-gray-500">{property.location}</p>
          <p className="text-2xl text-blue-700 font-semibold mb-6">${property.price} / noche</p>

          {Array.isArray(property.image) && property.image.length > 0 && (
            <ImageSlider images={property.image} />
          )}

          <div className="space-y-3 text-gray-700">
            <p><strong>Capacidad:</strong> {property.capacity} personas</p>
            <p><strong>Amenidades:</strong> {Array.isArray(property.amenities) ? property.amenities.join(', ') : property.amenities}</p>
            <p><strong>Descripción:</strong> {property.description || 'Sin descripción.'}</p>
            {property.address && <p><strong>Dirección:</strong> {property.address}</p>}
            {property.phone && <p><strong>Teléfono:</strong> {property.phone}</p>}
            {property.contactEmail && <p><strong>Correo:</strong> {property.contactEmail}</p>}
            {property.hostName && <p><strong>Anfitrión:</strong> {property.hostName}</p>}
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Reservar</h2>
          <div className="space-y-4">
            <input type="text" name="name" placeholder="Tu nombre"
              value={formData.name} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

            <input type="email" name="email" placeholder="Tu correo"
              value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

            <div className="flex flex-col md:flex-row gap-4">
              <input type="date" name="checkIn"
                value={formData.checkIn} onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

              <input type="date" name="checkOut"
                value={formData.checkOut} onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <input type="number" name="guests" min={1}
              value={formData.guests} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

            <button onClick={handleReservation}
              className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700">
              Contactar por WhatsApp
            </button>

            {property.hostName && (
              <div className="mt-6 p-4 bg-blue-50 border rounded-lg text-blue-800">
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
