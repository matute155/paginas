/**
 * WhatsApp Integration Utilities for DesdeAca.com
 * Handles contact between guests and property owners
 */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Generates a WhatsApp contact URL with predefined message
 * @param {Object} params - Contact parameters
 * @param {string} params.ownerPhone - Owner's WhatsApp number (with country code)
 * @param {string} params.propertyTitle - Property title
 * @param {Date} params.checkIn - Check-in date
 * @param {Date} params.checkOut - Check-out date
 * @param {string} params.guestName - Guest's name (optional)
 * @param {number} params.guests - Number of guests (optional)
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppLink({
  ownerPhone,
  propertyTitle,
  checkIn,
  checkOut,
  guestName = '',
  guests = 1
}) {
  // Format phone number (ensure it starts with +54 for Argentina)
  const formattedPhone = formatPhoneNumber(ownerPhone);
  
  // Format dates in Spanish
  const checkInFormatted = format(checkIn, "d 'de' MMMM 'de' yyyy", { locale: es });
  const checkOutFormatted = format(checkOut, "d 'de' MMMM 'de' yyyy", { locale: es });
  
  // Generate personalized message
  const message = generateContactMessage({
    propertyTitle,
    checkIn: checkInFormatted,
    checkOut: checkOutFormatted,
    guestName,
    guests
  });
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Return WhatsApp URL
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Formats phone number for WhatsApp
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add Argentina country code if not present
  if (!cleaned.startsWith('549')) {
    if (cleaned.startsWith('54')) {
      cleaned = '549' + cleaned.slice(2);
    } else if (cleaned.startsWith('9')) {
      cleaned = '549' + cleaned.slice(1);
    } else {
      cleaned = '549' + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * Generates the contact message template
 * @param {Object} params - Message parameters
 * @returns {string} Formatted message
 */
function generateContactMessage({
  propertyTitle,
  checkIn,
  checkOut,
  guestName,
  guests
}) {
  let message = `¡Hola! Vi tu propiedad "${propertyTitle}" en DesdeAca.com y me interesa hacer una reserva.

📅 Fechas: ${checkIn} al ${checkOut}
👥 Huéspedes: ${guests} ${guests === 1 ? 'persona' : 'personas'}`;

  if (guestName) {
    message = `¡Hola! Soy ${guestName} y ${message.slice(8)}`;
  }

  message += `

¿Está disponible para esas fechas? ¿Podrías confirmarme el precio total?

¡Gracias!`;

  return message;
}

/**
 * Generates a quick contact message for general inquiries
 * @param {string} ownerPhone - Owner's phone number
 * @param {string} propertyTitle - Property title
 * @returns {string} WhatsApp URL
 */
export function generateQuickContactLink(ownerPhone, propertyTitle) {
  const formattedPhone = formatPhoneNumber(ownerPhone);
  const message = encodeURIComponent(
    `¡Hola! Vi tu propiedad "${propertyTitle}" en DesdeAca.com y me gustaría obtener más información. ¿Podrías ayudarme?`
  );
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

/**
 * Validates if a phone number is valid for WhatsApp
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid
 */
export function isValidWhatsAppNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  // Argentine mobile numbers should have 10-11 digits after country code
  return cleaned.length >= 12 && cleaned.length <= 13;
}

/**
 * Generates a contact message for property inquiries from the platform
 * @param {Object} inquiry - Inquiry details
 * @returns {string} Formatted message
 */
export function generateInquiryMessage(inquiry) {
  const { guestName, guestPhone, propertyTitle, message, checkIn, checkOut } = inquiry;
  
  const checkInFormatted = format(new Date(checkIn), "d 'de' MMMM", { locale: es });
  const checkOutFormatted = format(new Date(checkOut), "d 'de' MMMM", { locale: es });
  
  return `Nueva consulta desde DesdeAca.com

🏠 Propiedad: ${propertyTitle}
👤 Huésped: ${guestName}
📱 Teléfono: ${guestPhone}
📅 Fechas: ${checkInFormatted} al ${checkOutFormatted}

💬 Mensaje:
${message}

---
DesdeAca.com - Alquileres temporarios en San Juan`;
}