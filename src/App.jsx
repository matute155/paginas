// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Accommodations from '@/pages/Accommodations';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Testimonials from '@/pages/Testimonials';
import AddProperty from '@/pages/AddProperty';
import AdminPanel from '@/pages/AdminPanel';
import PropertyDetails from '@/pages/PropertyDetails';
import AdminReservations from '@/pages/AdminReservations';

// Configuración centralizada de Axios (opcional)
const configureAxios = () => {
  axios.defaults.baseURL = '/api';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  // Puedes agregar más configuraciones globales aquí
};

// Ejecutar la configuración al cargar el App
configureAxios();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alojamientos" element={<Accommodations />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/testimonios" element={<Testimonials />} />
            <Route path="/agregar-propiedad" element={<AddProperty />} />
            <Route path="/admin" element={<AdminPanel isAuthenticated={isAuthenticated} />} />
            <Route path="/propiedad/:id" element={<PropertyDetails />} />
            <Route path="/admin/reservas" element={<AdminReservations />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;