
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Award, Target, Eye, Zap } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Hospitalidad",
      description: "Creemos en la calidez humana y en hacer que cada huésped se sienta como en casa."
    },
    {
      icon: Shield,
      title: "Confianza",
      description: "Verificamos cada propiedad y propietario para garantizar experiencias seguras."
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Conectamos viajeros con locales para crear experiencias auténticas."
    },
    {
      icon: Award,
      title: "Calidad",
      description: "Mantenemos altos estándares en todas nuestras propiedades y servicios."
    }
  ];

  const team = [
  {
    name: "Matias Sanchez",
    role: "Fundador & CEO",
    description: "Apasionado por el turismo y la hospitalidad sanjuanina.",
    image: "/img/personita.jpg"

  },
  {
    name: "Adrian Vargas",
    role: "Director de Operaciones",
    description: "Experto en gestión hotelera con 15 años de experiencia.",
    image: "/img/personita.jpg"

  },
  {
    name: "Andre Arancibia",
    role: "Gerente de Atención al Cliente",
    description: "Dedicada a brindar la mejor experiencia a nuestros usuarios.",
    image: "/img/personita.jpg"

  }
];


  const stats = [
    { number: "40+", label: "Propiedades Activas" },
    { number: "250+", label: "Huéspedes Satisfechos" },
    { number: "4.8", label: "Calificación Promedio" },
    { number: "2", label: "Años de Experiencia" }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Somos una plataforma local dedicada a conectar viajeros con los mejores 
              alojamientos de San Juan, promoviendo el turismo auténtico y sostenible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Facilitar experiencias de alojamiento únicas en San Juan, conectando 
                  viajeros con propietarios locales para crear memorias inolvidables y 
                  promover el desarrollo turístico de nuestra hermosa provincia.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Eye className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Nuestra Visión</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Ser la plataforma líder de alquileres temporarios en San Juan, 
                  reconocida por la calidad de nuestros servicios, la confianza de 
                  nuestros usuarios y nuestro compromiso con el turismo responsable.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10">
              
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en Desde Acá San Juan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center card-hover"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Logros
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Números que reflejan nuestro compromiso y crecimiento
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
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

      {/* Team */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce a las personas apasionadas que hacen posible Desde Aca San Juan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
              >
                <div className="h-64 overflow-hidden">
                  <img  
                    className="w-full h-full object-cover"
                    alt={`${member.name} - ${member.role} de San Juan Stays`}
                   src={member.image}
 />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why San Juan */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img  
                className="rounded-2xl shadow-2xl"
                alt="Atractivos turísticos de San Juan - Dique y montañas"
               src="https://images.unsplash.com/photo-1622984855078-2f6e2481e350" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <Zap className="w-8 h-8 text-yellow-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">¿Por Qué San Juan?</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Destino Único
                  </h3>
                  <p className="text-gray-600">
                    San Juan ofrece paisajes únicos, desde desiertos hasta montañas, 
                    viñedos y sitios arqueológicos que cautivan a todo tipo de viajero.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Hospitalidad Local
                  </h3>
                  <p className="text-gray-600">
                    Los sanjuaninos son conocidos por su calidez y hospitalidad, 
                    haciendo que cada visita sea una experiencia memorable.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Turismo Sostenible
                  </h3>
                  <p className="text-gray-600">
                    Promovemos un turismo responsable que beneficia a las comunidades 
                    locales y preserva nuestro patrimonio natural y cultural.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
