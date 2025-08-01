import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

const AdminReservations = ({ isAuthenticated }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchReservations = async () => {
      try {
        // ✅ Changed to relative path for Vercel
        const response = await axios.get('/api/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las reservas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [isAuthenticated, toast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Acceso no autorizado</h1>
        <p>Debes iniciar sesión para ver las reservas</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reservas realizadas</h1>
        <p>Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservas realizadas</h1>
      {reservations.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Propiedad</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Ubicación</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Nombre</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Check-in</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Check-out</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Huéspedes</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((resv) => (
                <tr key={resv.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-900 border-b">{resv.propertyTitle}</td>
                  <td className="p-3 text-sm text-gray-600 border-b">{resv.propertyLocation}</td>
                  <td className="p-3 text-sm text-gray-900 border-b">{resv.name}</td>
                  <td className="p-3 text-sm text-gray-600 border-b">{resv.email}</td>
                  <td className="p-3 text-sm text-gray-900 border-b">{formatDate(resv.checkIn)}</td>
                  <td className="p-3 text-sm text-gray-900 border-b">{formatDate(resv.checkOut)}</td>
                  <td className="p-3 text-sm text-gray-900 border-b">{resv.guests}</td>
                  <td className="p-3 text-sm border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resv.status === 'confirmada' 
                        ? 'bg-green-100 text-green-800' 
                        : resv.status === 'cancelada'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {resv.status}
                    </span>
                  </td>
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