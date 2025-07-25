// src/pages/AdminReservations.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Petición a ruta relativa; Vercel la reenviará a tu backend
    axios.get('/api/reservations')
      .then((res) => {
        console.log(res.data);
        setReservations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener reservas:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Cargando reservas...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservas realizadas</h1>
      {reservations.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Propiedad</th>
                <th className="p-2 border">Ubicación</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Check-in</th>
                <th className="p-2 border">Check-out</th>
                <th className="p-2 border">Huéspedes</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((resv) => (
                <tr key={resv.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{resv.propertyTitle}</td>
                  <td className="p-2 border">{resv.propertyLocation}</td>
                  <td className="p-2 border">{resv.name}</td>
                  <td className="p-2 border">{resv.email}</td>
                  <td className="p-2 border">{resv.checkIn}</td>
                  <td className="p-2 border">{resv.checkOut}</td>
                  <td className="p-2 border">{resv.guests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
