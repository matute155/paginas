import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AdminPanel = ({ isAuthenticated }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProperties = async () => {
      try {
        // ✅ Changed to relative path for Vercel
        const res = await axios.get('/api/properties');
        setProperties(res.data);
      } catch (err) {
        console.error("Error al cargar propiedades:", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar las propiedades",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [isAuthenticated, toast]);

  const handleApprove = async (id) => {
    try {
      // ✅ Changed to relative path for Vercel
      await axios.put(`/api/properties/${id}/approve`);
      setProperties(prev =>
        prev.map(p => (p.id === id ? { ...p, status: 'aprobado' } : p))
      );
      toast({
        title: "Propiedad aprobada",
        description: "La propiedad ha sido aprobada correctamente",
      });
    } catch (err) {
      console.error('Error al aprobar propiedad:', err);
      toast({
        title: "Error",
        description: "No se pudo aprobar la propiedad",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    try {
      // ✅ Changed to relative path for Vercel
      await axios.delete(`/api/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Propiedad eliminada",
        description: "La propiedad ha sido eliminada correctamente",
      });
    } catch (err) {
      console.error('Error al eliminar propiedad:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la propiedad",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso no autorizado</h1>
        <p>Debes iniciar sesión para acceder al panel de administración</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Cargando propiedades...</h1>
      </div>
    );
  }

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
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">{prop.title}</h2>
                  <p className="text-sm text-gray-600">{prop.location} — ${prop.price} / noche</p>
                  <p className="text-sm">Capacidad: {prop.capacity}</p>
                </div>
                <span className={`text-sm font-medium ${
                  prop.status === 'aprobado' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {prop.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                {prop.status === 'pendiente' && (
                  <Button 
                    onClick={() => handleApprove(prop.id)} 
                    variant="default"
                    size="sm"
                  >
                    Aprobar
                  </Button>
                )}
                <Button 
                  onClick={() => handleDelete(prop.id)} 
                  variant="destructive"
                  size="sm"
                >
                  Eliminar
                </Button>
                <Link to={`/propiedad/${prop.id}`}>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;