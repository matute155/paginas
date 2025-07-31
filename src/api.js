const API_URL = import.meta.env.VITE_API_URL;

// Aprobar una propiedad
export const approveProperty = async (id) => {
  const res = await fetch(`${API_URL}/api/properties/${id}/approve`, {
    method: 'PUT',
  });
  return res.json();
};

// Eliminar una propiedad
export const deleteProperty = async (id) => {
  const res = await fetch(`${API_URL}/api/properties/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

// Login del admin
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// Obtener todas las propiedades
export const fetchProperties = async () => {
  const res = await fetch(`${API_URL}/api/properties`);
  return res.json();
};

// Crear reserva
export const createReservation = async (reservationData) => {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });
  return res.json();
};

// ✅ Exportar API_URL para que lo uses donde lo necesites
export { API_URL };
