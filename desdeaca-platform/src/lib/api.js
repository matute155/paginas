import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://desdeaca.vercel.app/api' 
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // You could dispatch a logout action here if using Redux/Context
    }
    return Promise.reject(error);
  }
);

// API Service Functions

// Properties API
export const propertiesAPI = {
  // Get all properties with filtering
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/properties', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cargar propiedades');
    }
  },

  // Get single property by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cargar la propiedad');
    }
  },

  // Create new property
  create: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear la propiedad');
    }
  },

  // Update existing property
  update: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la propiedad');
    }
  },

  // Delete property
  delete: async (id, ownerId) => {
    try {
      const response = await api.delete(`/properties/${id}`, {
        data: { owner_id: ownerId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar la propiedad');
    }
  }
};

// Users/Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/users?action=register', userData);
      const { user, token } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/users?action=login', credentials);
      const { user, token } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cargar el perfil');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get stored user data
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// WhatsApp API
export const whatsappAPI = {
  // Generate WhatsApp contact link
  generateContactLink: async (contactData) => {
    try {
      const response = await api.post('/whatsapp/send', contactData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al generar enlace de WhatsApp');
    }
  },

  // Generate quick contact link
  generateQuickContactLink: async (propertyId) => {
    try {
      const response = await api.post('/whatsapp/send', {
        property_id: propertyId,
        type: 'quick'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al generar enlace de WhatsApp');
    }
  }
};

// Helper functions for local storage management
export const storage = {
  // Get all properties from localStorage (for offline caching)
  getCachedProperties: () => {
    try {
      const cached = localStorage.getItem('cachedProperties');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      return [];
    }
  },

  // Cache properties in localStorage
  setCachedProperties: (properties) => {
    try {
      localStorage.setItem('cachedProperties', JSON.stringify(properties));
      localStorage.setItem('propertiesCacheTime', Date.now().toString());
    } catch (error) {
      console.error('Error caching properties:', error);
    }
  },

  // Check if cached properties are still valid (1 hour cache)
  isCacheValid: () => {
    try {
      const cacheTime = localStorage.getItem('propertiesCacheTime');
      if (!cacheTime) return false;
      
      const oneHour = 60 * 60 * 1000;
      return (Date.now() - parseInt(cacheTime)) < oneHour;
    } catch (error) {
      return false;
    }
  },

  // Clear all cached data
  clearCache: () => {
    localStorage.removeItem('cachedProperties');
    localStorage.removeItem('propertiesCacheTime');
  }
};

// Error handler for common API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Datos inválidos';
      case 401:
        return 'No autorizado. Por favor inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'No encontrado';
      case 409:
        return data.message || 'Conflicto con datos existentes';
      case 429:
        return 'Demasiadas peticiones. Intenta nuevamente en unos minutos.';
      case 500:
        return 'Error del servidor. Intenta nuevamente más tarde.';
      default:
        return data.message || `Error ${status}`;
    }
  } else if (error.request) {
    // Network error
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    // Other error
    return error.message || 'Error inesperado';
  }
};

// Export the axios instance for direct use if needed
export default api;