# DesdeAca.com - Plataforma de Alquileres Temporarios

Una plataforma moderna para alquileres temporarios en San Juan, Argentina, que conecta propietarios con huéspedes a través de WhatsApp.

## 🌟 Características

### Para Huéspedes
- **Búsqueda avanzada** con filtros por ubicación, fecha, precio y amenities
- **Galería de imágenes** con navegación interactiva
- **Contacto directo** con propietarios vía WhatsApp
- **Mensajes predefinidos** en español con detalles de la reserva
- **Diseño mobile-first** optimizado para dispositivos móviles

### Para Propietarios
- **Dashboard intuitivo** para gestionar propiedades
- **CRUD completo** de propiedades con imágenes
- **Calendario de disponibilidad**
- **Recepción automática** de consultas por WhatsApp

### Características Técnicas
- **React + Vite** para máximo rendimiento
- **Tailwind CSS** con diseño personalizado para San Juan
- **Integración WhatsApp** con enlaces directos
- **SEO optimizado** para búsquedas locales
- **Mapas interactivos** con Leaflet
- **Responsive design** para todos los dispositivos

## 🚀 Tecnologías

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **React Router** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos
- **Date-fns** - Manipulación de fechas

### Integraciones
- **WhatsApp Business API** - Comunicación directa
- **Leaflet** - Mapas interactivos
- **Cloudinary** - Gestión de imágenes (próximamente)

### Backend (Próximamente)
- **Node.js** - Servidor
- **PostgreSQL** - Base de datos
- **Vercel Serverless Functions** - API sin servidor

## 🏗️ Estructura del Proyecto

```
desdeaca-platform/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx       # Navegación principal
│   │   ├── PropertyCard.jsx # Tarjeta de propiedad
│   │   └── SearchFilters.jsx# Filtros de búsqueda
│   ├── pages/              # Páginas principales
│   │   ├── HomePage.jsx    # Página de inicio
│   │   └── PropertyDetail.jsx # Detalle de propiedad
│   ├── lib/                # Utilidades
│   │   └── whatsapp.js     # Integración WhatsApp
│   ├── types/              # Definiciones de tipos
│   │   └── index.js        # Constantes y tipos
│   └── hooks/              # Hooks personalizados
├── api/                    # Backend API (próximamente)
│   ├── properties/         # Endpoints de propiedades
│   └── users/             # Endpoints de usuarios
└── public/                # Archivos estáticos
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ y npm

### Configuración local
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/desdeaca-platform.git
cd desdeaca-platform

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:5173
```

### Scripts disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Verificar código con ESLint
```

## 🌍 Zonas de San Juan

La plataforma incluye las siguientes zonas de San Juan:

- **Centro** - Zona comercial y turística
- **Villa Krause** - Área residencial tranquila
- **Chimbas** - Zona en crecimiento
- **Rawson** - Capital provincial
- **Pocito** - Zona vitivinícola
- **Santa Lucía** - Área histórica
- **Ullúm** - Zona del dique y deportes acuáticos
- **Zonda** - Área natural y windsurfing
- **Caucete** - Zona rural
- **Rivadavia** - Área sur

## 📱 Integración WhatsApp

### Características
- **Números argentinos** con código +549
- **Mensajes personalizados** con datos de la consulta
- **Enlaces directos** que abren WhatsApp
- **Plantillas en español** adaptadas al contexto local

### Ejemplo de mensaje generado
```
¡Hola! Vi tu propiedad "Casa amplia con quincho en Villa Krause" en DesdeAca.com y me interesa hacer una reserva.

📅 Fechas: 15 de enero de 2024 al 20 de enero de 2024
👥 Huéspedes: 4 personas

¿Está disponible para esas fechas? ¿Podrías confirmarme el precio total?

¡Gracias!
```

## 🎨 Diseño y UX

### Colores
- **Primario**: Azul moderno para la interfaz
- **San Juan**: Naranja cálido inspirado en la provincia
- **Neutros**: Grises para textos y fondos

### Tipografía
- **Inter** - Fuente principal moderna y legible
- **Responsive**: Optimizado para móviles (mobile-first)

## 🔜 Próximas Características

### Fase 2 - Backend y Autenticación
- [ ] API REST con Node.js
- [ ] Base de datos PostgreSQL
- [ ] Sistema de autenticación
- [ ] Dashboard para propietarios

### Fase 3 - Funcionalidades Avanzadas
- [ ] Sistema de reseñas
- [ ] Calendario de disponibilidad
- [ ] Notificaciones push
- [ ] Chat integrado

### Fase 4 - Optimizaciones
- [ ] Progressive Web App (PWA)
- [ ] Modo offline
- [ ] Análisis y métricas
- [ ] Sistema de pagos (opcional)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

- **Website**: [DesdeAca.com](https://desdeaca.com)
- **Email**: contacto@desdeaca.com
- **San Juan, Argentina**

---

*Hecho con ❤️ en San Juan, Argentina*
