
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Laura Fernández",
      location: "Buenos Aires",
      rating: 5,
      text: "Increíble experiencia en San Juan. La casa que alquilamos en Pocito era exactamente como se mostraba en las fotos. Los propietarios fueron súper amables y nos dieron excelentes recomendaciones de lugares para visitar.",
      property: "Casa Familiar con Piscina",
      image: "Happy woman tourist in San Juan Argentina smiling"
    },
    {
      id: 2,
      name: "Miguel Torres",
      location: "Córdoba",
      rating: 5,
      text: "Perfecto para nuestras vacaciones familiares. El departamento tenía una vista espectacular a las montañas y estaba muy bien ubicado. La plataforma hizo que todo el proceso de reserva fuera muy fácil.",
      property: "Departamento con Vista a la Montaña",
      image: "Happy man tourist with family in San Juan mountains"
    },
    {
      id: 3,
      name: "Ana y Roberto",
      location: "Mendoza",
      rating: 5,
      text: "Nuestra luna de miel en San Juan fue perfecta gracias a San Juan Stays. El loft que elegimos era moderno, cómodo y tenía todo lo que necesitábamos. ¡Definitivamente volveremos!",
      property: "Loft Industrial en Chimbas",
      image: "Happy couple tourists in San Juan romantic setting"
    },
    {
      id: 4,
      name: "Carlos Mendoza",
      location: "Rosario",
      rating: 5,
      text: "Excelente atención al cliente. Tuvimos un pequeño inconveniente y lo resolvieron inmediatamente. La casa de campo en Caucete era un paraíso, perfecta para desconectarse de la ciudad.",
      property: "Casa de Campo en Caucete",
      image: "Happy man tourist relaxing in countryside San Juan"
    },
    {
      id: 5,
      name: "Familia Rodríguez",
      location: "Santa Fe",
      rating: 5,
      text: "Viajamos con nuestros tres hijos y la casa tenía todo lo necesario para una estadía cómoda. La piscina fue el hit de las vacaciones. Los niños no querían irse. ¡Gracias por hacer nuestras vacaciones inolvidables!",
      property: "Casa Moderna en Centro",
      image: "Happy family with children enjoying vacation in San Juan"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const stats = [
    { number: "98%", label: "Satisfacción del Cliente" },
    { number: "4.8/5", label: "Calificación Promedio" },
    { number: "80+", label: "Reseñas Positivas" },
    { number: "95%", label: "Recomendarían" }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Testimonios
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Descubre lo que nuestros huéspedes dicen sobre sus experiencias
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="h-64 lg:h-auto">
                <img  
                  className="w-full h-full object-cover"
                  alt={`${testimonials[currentTestimonial].name} - Cliente satisfecho de San Juan Stays`}
                 src="https://images.unsplash.com/photo-1644424235476-295f24d503d9" />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Quote className="w-12 h-12 text-blue-600 mb-6" />
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>

                <div className="mb-4">
                  <p className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].location}
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Se alojó en: {testimonials[currentTestimonial].property}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevTestimonial}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextTestimonial}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Más Testimonios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lee más experiencias de nuestros huéspedes satisfechos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 card-hover border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>

                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {testimonial.location}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    {testimonial.property}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para Tu Próxima Aventura?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a cientos de viajeros que ya han descubierto la magia de San Juan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Buscar Alojamientos
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Agregar Mi Propiedad
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
