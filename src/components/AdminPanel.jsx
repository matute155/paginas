import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { approveProperty, deleteProperty, fetchProperties } from '../api';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';

const AdminPanel = ({ isAuthenticated }) => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      loadProperties();
    }
  }, [isAuthenticated]);

  const loadProperties = async () => {
    try {
      const all = await fetchProperties();
      const pending = all.filter((prop) => prop.status === 'pendiente');
      setProperties(pending);
    } catch (err) {
      toast({
        title: 'Error al cargar propiedades',
        description: err.message || 'Ocurrió un error al obtener los datos.',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProperty(id);
      toast({
        title: 'Propiedad aprobada',
        description: `La propiedad ${id} fue aprobada.`,
      });
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast({
        title: 'Error al aprobar',
        description: err.message || 'No se pudo aprobar la propiedad.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      toast({
        title: 'Propiedad eliminada',
        description: `La propiedad ${id} fue eliminada.`,
      });
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast({
        title: 'Error al eliminar',
        description: err.message || 'No se pudo eliminar la propiedad.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      {properties.length === 0 ? (
        <p className="text-gray-500">No hay propiedades pendientes por aprobar.</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-xl p-4 shadow-md bg-white">
              <h2 className="text-xl font-semibold">{property.title}</h2>
              <p className="text-sm text-gray-600">{property.location}</p>
              <p className="text-sm text-gray-600">{property.description}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => handleApprove(property.id)}>Aprobar</Button>
                <Button variant="destructive" onClick={() => handleDelete(property.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
