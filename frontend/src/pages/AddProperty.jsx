import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const AddProperty = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', address: '', propertyType: '',
    capacity: 1, bedrooms: 1, bathrooms: 1, price: '', amenities: [], images: [],
    rules: '', contactName: '', contactEmail: '', contactPhone: ''
  });

  const steps = [
    'Información Básica',
    'Detalles y Amenidades',
    'Fotos y Precio',
    'Contacto y Reglas'
  ];

  const locations = ['Capital', 'Rivadavia', 'Chimbas', 'Rawson', 'Pocito', 'Santa Lucía', 'Albardón', 'Angaco', 'Calingasta', 'Caucete'];
  const propertyTypes = ['Casa', 'Departamento', 'Cabaña', 'Quinta'];
  const amenities = ['Wifi', 'Piscina', 'Estacionamiento', 'Cocina', 'TV', 'Aire Acondicionado', 'Calefacción', 'Parrilla', 'Jardín', 'Balcón', 'Terraza', 'Lavadora'];

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries({
        title: formData.title,
        location: formData.location,
        price: formData.price,
        rating: 0,
        reviews: 0,
        capacity: formData.capacity,
        description: formData.description,
        address: formData.address,
        phone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        hostName: formData.contactName,
        amenities: JSON.stringify(formData.amenities),
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        rules: formData.rules
      }).forEach(([key, value]) => form.append(key, value));

      formData.images.forEach(image => form.append('images', image));

      await axios.post(`${import.meta.env.VITE_API_URL}/api/properties`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast({ title: "¡Propiedad enviada!", description: "Tu propiedad ha sido enviada correctamente." });
      setFormData({ title: '', description: '', location: '', address: '', propertyType: '', capacity: 1, bedrooms: 1, bathrooms: 1, price: '', amenities: [], images: [], rules: '', contactName: '', contactEmail: '', contactPhone: '' });
      setCurrentStep(1);
    } catch (error) {
      console.error(error);
      toast({ title: "Error al guardar", description: "No se pudo guardar la propiedad.", variant: "destructive" });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid gap-6">
            <Input label="Título" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
            <Textarea label="Descripción" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
            <Select label="Ubicación" options={locations} value={formData.location} onChange={e => handleInputChange('location', e.target.value)} />
            <Select label="Tipo de Propiedad" options={propertyTypes} value={formData.propertyType} onChange={e => handleInputChange('propertyType', e.target.value)} />
            <Input label="Dirección" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
          </div>
        );
      case 2:
        return (
          <div className="grid gap-6">
            <Select label="Capacidad" options={Array.from({ length: 10 }, (_, i) => i + 1)} value={formData.capacity} onChange={e => handleInputChange('capacity', parseInt(e.target.value))} />
            <Select label="Dormitorios" options={[1,2,3,4,5]} value={formData.bedrooms} onChange={e => handleInputChange('bedrooms', parseInt(e.target.value))} />
            <Select label="Baños" options={[1,2,3,4,5]} value={formData.bathrooms} onChange={e => handleInputChange('bathrooms', parseInt(e.target.value))} />
            <CheckboxGroup label="Amenidades" options={amenities} selected={formData.amenities} onToggle={handleAmenityToggle} />
          </div>
        );
      case 3:
        return (
          <div className="grid gap-6">
            <Input label="Precio por Noche (ARS)" icon={<DollarSign className="text-gray-400" />} value={formData.price} onChange={e => handleInputChange('price', e.target.value)} />
            <FileUpload onChange={e => handleInputChange('images', Array.from(e.target.files))} />
          </div>
        );
      case 4:
        return (
          <div className="grid gap-6">
            <Input label="Nombre Completo" value={formData.contactName} onChange={e => handleInputChange('contactName', e.target.value)} />
            <Input label="Email" type="email" value={formData.contactEmail} onChange={e => handleInputChange('contactEmail', e.target.value)} />
            <Input label="Teléfono" value={formData.contactPhone} onChange={e => handleInputChange('contactPhone', e.target.value)} />
            <Textarea label="Reglas de la Casa" value={formData.rules} onChange={e => handleInputChange('rules', e.target.value)} />
          </div>
        );
    }
  };

  return (
    <div className="pt-20 pb-10 px-4 bg-gray-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Publicá tu Propiedad</h1>
          <p className="text-gray-500 mt-2">Completá los datos paso a paso para agregar un hospedaje</p>
        </div>

        <div className="mb-6 flex justify-between">
          {steps.map((label, index) => (
            <div key={index} className="flex-1 text-center">
              <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${currentStep === index + 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>{index + 1}</div>
              <p className={`mt-2 text-sm ${currentStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{label}</p>
            </div>
          ))}
        </div>

        <motion.form onSubmit={handleSubmit} key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="bg-white p-8 rounded-xl shadow-md space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1}>Anterior</Button>
            {currentStep < 4 ? (
              <Button type="button" onClick={() => setCurrentStep(s => s + 1)}>Siguiente</Button>
            ) : (
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Enviar Propiedad</Button>
            )}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

// Input, Textarea, Select, CheckboxGroup, FileUpload definidos igual que antes...

export default AddProperty;
