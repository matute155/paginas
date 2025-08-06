import { query } from '../../lib/db.js';
import { generateWhatsAppLink, generateQuickContactLink, isValidWhatsAppNumber } from '../../src/lib/whatsapp.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: 'Solo se permite método POST'
    });
  }

  try {
    const {
      property_id,
      guest_name,
      guest_phone,
      guest_email,
      check_in,
      check_out,
      guests = 1,
      message,
      type = 'detailed' // 'detailed' or 'quick'
    } = req.body;

    // Validate required fields
    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: 'ID de propiedad requerido'
      });
    }

    // Get property and owner information
    const propertyQuery = `
      SELECT 
        p.id, p.title, p.owner_id,
        u.name as owner_name,
        u.phone as owner_phone,
        u.whatsapp_number as owner_whatsapp
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1 AND p.status = 'active'
    `;

    const propertyResult = await query(propertyQuery, [property_id]);

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada o no disponible'
      });
    }

    const property = propertyResult.rows[0];
    const ownerPhone = property.owner_whatsapp || property.owner_phone;

    if (!ownerPhone || !isValidWhatsAppNumber(ownerPhone)) {
      return res.status(400).json({
        success: false,
        message: 'El propietario no tiene un número de WhatsApp válido configurado'
      });
    }

    let whatsappUrl;

    if (type === 'quick') {
      // Generate quick contact link
      whatsappUrl = generateQuickContactLink(ownerPhone, property.title);
    } else {
      // Validate required fields for detailed contact
      if (!check_in || !check_out) {
        return res.status(400).json({
          success: false,
          message: 'Fechas de entrada y salida requeridas para consulta detallada'
        });
      }

      // Validate dates
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de entrada no puede ser anterior a hoy'
        });
      }

      if (checkOutDate <= checkInDate) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de salida debe ser posterior a la fecha de entrada'
        });
      }

      // Generate detailed WhatsApp link
      whatsappUrl = generateWhatsAppLink({
        ownerPhone,
        propertyTitle: property.title,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestName: guest_name || '',
        guests: parseInt(guests)
      });
    }

    // Save inquiry to database for tracking
    let inquiryId = null;
    if (type === 'detailed') {
      try {
        const inquiryResult = await query(`
          INSERT INTO inquiries (
            property_id, guest_name, guest_phone, guest_email, 
            check_in, check_out, guests, message, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
          RETURNING id
        `, [
          property_id,
          guest_name || null,
          guest_phone || null,
          guest_email || null,
          check_in,
          check_out,
          guests,
          message || null,
          'pending'
        ]);

        inquiryId = inquiryResult.rows[0].id;
      } catch (error) {
        console.error('Error saving inquiry:', error);
        // Don't fail the request if inquiry saving fails
      }
    }

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        whatsapp_url: whatsappUrl,
        inquiry_id: inquiryId,
        property: {
          id: property.id,
          title: property.title,
          owner_name: property.owner_name
        },
        contact_type: type
      },
      message: type === 'quick' 
        ? 'Enlace de WhatsApp generado para consulta rápida'
        : 'Enlace de WhatsApp generado con detalles de reserva'
    });

  } catch (error) {
    console.error('WhatsApp API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Helper function to update inquiry status (can be called from external tracking)
export async function updateInquiryStatus(inquiryId, status) {
  try {
    await query(
      'UPDATE inquiries SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, inquiryId]
    );
    return true;
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return false;
  }
}