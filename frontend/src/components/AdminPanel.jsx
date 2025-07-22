import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminPanel = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
    </div>
  );
};
