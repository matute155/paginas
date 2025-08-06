import React, { useState } from 'react';
import { MessageCircle, Calendar, Users, User } from 'lucide-react';
import { generateWhatsAppLink } from '../lib/whatsapp';

const ContactForm = ({ property, onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.checkIn) {
      newErrors.checkIn = 'Selecciona la fecha de entrada';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Selecciona la fecha de salida';
    }

    if (formData.checkIn && formData.checkOut && new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      newErrors.checkOut = 'La fecha de salida debe ser posterior a la entrada';
    }

    if (formData.guests > property.capacity) {
      newErrors.guests = `Máximo ${property.capacity} huéspedes`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Generate WhatsApp link
    const whatsappUrl = generateWhatsAppLink({
      ownerPhone: property.owner.phone,
      propertyTitle: property.title,
      checkIn: new Date(formData.checkIn),
      checkOut: new Date(formData.checkOut),
      guestName: formData.guestName,
      guests: formData.guests
    });

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close form
    if (onClose) {
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Contactar propietario
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Guest name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Tu nombre (opcional)
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => handleChange('guestName', e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="input-field"
          />
        </div>

        {/* Check-in and check-out */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Entrada
            </label>
            <input
              type="date"
              value={formData.checkIn}
              onChange={(e) => handleChange('checkIn', e.target.value)}
              className={`input-field ${errors.checkIn ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.checkIn && (
              <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Salida
            </label>
            <input
              type="date"
              value={formData.checkOut}
              onChange={(e) => handleChange('checkOut', e.target.value)}
              className={`input-field ${errors.checkOut ? 'border-red-500' : ''}`}
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
            />
            {errors.checkOut && (
              <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>
            )}
          </div>
        </div>

        {/* Number of guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Users className="w-4 h-4 inline mr-1" />
            Número de huéspedes
          </label>
          <select
            value={formData.guests}
            onChange={(e) => handleChange('guests', parseInt(e.target.value))}
            className={`input-field ${errors.guests ? 'border-red-500' : ''}`}
          >
            {Array.from({ length: property.capacity }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} huésped{i + 1 !== 1 ? 'es' : ''}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className="text-red-500 text-xs mt-1">{errors.guests}</p>
          )}
        </div>

        {/* Additional message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje adicional (opcional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="¿Alguna pregunta específica sobre la propiedad?"
            rows={3}
            className="input-field"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Enviar consulta por WhatsApp</span>
        </button>

        {/* Property info reminder */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          <p className="font-medium text-gray-900 mb-1">{property.title}</p>
          <p>Propietario: {property.owner.name}</p>
          <p>Responde en: {property.owner.responseTime}</p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;