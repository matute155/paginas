// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Configuración de la URL base del backend
const API_BASE_URL = 'https://paginas-production.up.railway.app';

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Petición corregida con URL completa
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(res => setProperties(res.data))
      .catch(err => console.error("Error al cargar propiedades:", err));
  }, []);

  const handleApprove = (id) => {
    axios.put(`${API_BASE_URL}/api/properties/${id}/approve`)
      .then(() => {
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: 'aprobado' } : p))
        );
      })
      .catch(err => console.error('Error al aprobar propiedad:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    axios.delete(`${API_BASE_URL}/api/properties/${id}`)
      .then(() => {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(err => console.error('Error al eliminar propiedad:', err));
  };

  return (
    <div className="pt-20 px-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Link to="/admin/reservas">
          <Button>Ver reservas</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <p>No hay propiedades cargadas.</p>
      ) : (
        <div className="space-y-4">
          {properties.map(prop => (
            <div key={prop.id} className="p-4 border rounded shadow-sm bg-white">
              <h2 className="font-bold text-lg">{prop.title}</h2>
              <p className="text-sm text-gray-600">{prop.location} — ${prop.price} / noche</p>
              <p className="text-sm">Capacidad: {prop.capacity}</p>
              <p className="text-sm italic text-gray-500">{prop.status}</p>
              <div className="mt-2">
                {prop.status === 'pendiente' ? (
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(prop.id)} variant="default">Aprobar</Button>
                    <Button onClick={() => handleDelete(prop.id)} variant="destructive">Eliminar</Button>
                  </div>
                ) : (
                  <span className="text-green-600 font-semibold">Aprobado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;