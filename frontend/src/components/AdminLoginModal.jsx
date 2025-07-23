import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './ui/button';
import Input from './ui/input';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api'; // ✅ Importamos la función centralizada

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(credentials.email, credentials.password); // ✅ Usamos la función central

      if (res.success) {
        toast({
          title: 'Ingreso exitoso',
          description: 'Bienvenido, administrador.',
        });
        onClose();
        onLogin();
        navigate('/admin');
      } else {
        toast({
          title: 'Error de autenticación',
          description: res.message || 'Credenciales incorrectas',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error de autenticación',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
          <Dialog.Title className="text-lg font-bold">Acceso de Administrador</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              placeholder="Usuario"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Ingresar</Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AdminLoginModal;
