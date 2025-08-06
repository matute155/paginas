import { query } from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate phone number
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[0-9\-\s()]{8,20}$/;
  return phoneRegex.test(phone);
}

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      user_type: user.user_type 
    },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: '7d' }
  );
}

// Main API handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'POST':
        await handlePost(req, res);
        break;
      case 'GET':
        await handleGet(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Users API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Handle POST requests - Register or Login
async function handlePost(req, res) {
  const { action } = req.query; // 'register' or 'login'
  
  if (action === 'register') {
    await handleRegister(req, res);
  } else if (action === 'login') {
    await handleLogin(req, res);
  } else {
    res.status(400).json({
      success: false,
      message: 'Acción inválida. Use ?action=register o ?action=login'
    });
  }
}

// Handle user registration
async function handleRegister(req, res) {
  const {
    email,
    password,
    name,
    phone,
    whatsapp_number,
    user_type = 'guest' // 'guest' or 'owner'
  } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, contraseña y nombre son requeridos'
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  // Validate phone if provided
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de teléfono inválido'
    });
  }

  // Validate WhatsApp number if provided
  if (whatsapp_number && !isValidPhone(whatsapp_number)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de número de WhatsApp inválido'
    });
  }

  // Validate user type
  if (!['guest', 'owner'].includes(user_type)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de usuario inválido'
    });
  }

  // Check if email already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un usuario con este email'
    });
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Insert new user
  const insertQuery = `
    INSERT INTO users (email, password_hash, name, phone, whatsapp_number, user_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, name, phone, whatsapp_number, user_type, verified, created_at
  `;

  const result = await query(insertQuery, [
    email.toLowerCase(),
    passwordHash,
    name.trim(),
    phone || null,
    whatsapp_number || null,
    user_type
  ]);

  const newUser = result.rows[0];

  // Generate JWT token
  const token = generateToken(newUser);

  // Return user data (excluding password)
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        whatsappNumber: newUser.whatsapp_number,
        type: newUser.user_type,
        verified: newUser.verified,
        createdAt: newUser.created_at
      },
      token
    },
    message: user_type === 'owner' 
      ? 'Cuenta de propietario creada exitosamente'
      : 'Cuenta creada exitosamente'
  });
}

// Handle user login
async function handleLogin(req, res) {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y contraseña son requeridos'
    });
  }

  // Find user by email
  const userResult = await query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (userResult.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  const user = userResult.rows[0];

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Generate JWT token
  const token = generateToken(user);

  // Return user data (excluding password)
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        whatsappNumber: user.whatsapp_number,
        type: user.user_type,
        verified: user.verified,
        createdAt: user.created_at
      },
      token
    },
    message: 'Inicio de sesión exitoso'
  });
}

// Handle GET requests - Get user profile (requires authentication)
async function handleGet(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autorización requerido'
    });
  }

  const token = authHeader.substring(7);

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');

    // Get user from database
    const userResult = await query(
      'SELECT id, email, name, phone, whatsapp_number, user_type, verified, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = userResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          whatsappNumber: user.whatsapp_number,
          type: user.user_type,
          verified: user.verified,
          createdAt: user.created_at
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    throw error;
  }
}