# Web App - Frontend React + Backend Serverless

Este proyecto combina un frontend React con Vite y un backend usando serverless functions en Vercel, conectado a una base de datos PostgreSQL en Neon.

## 🚀 Deployment en Vercel

### 1. Preparar la base de datos en Neon

1. Ve a [Neon](https://neon.tech) y crea una nueva base de datos
2. Copia la connection string que se ve así:
   ```
   postgresql://username:password@hostname:5432/database?sslmode=require
   ```

### 2. Configurar variables de entorno en Vercel

En tu proyecto de Vercel, agrega estas variables de entorno:

```bash
DATABASE_URL=postgresql://username:password@hostname:5432/database?sslmode=require
NODE_ENV=production
```

### 3. Deploy desde GitHub

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente el framework Vite
3. El build se ejecutará automáticamente

### 4. Migrar la base de datos

Después del primer deploy, ejecuta la migración:

```bash
curl -X POST https://tu-dominio.vercel.app/api/migrate
```

## 🔧 Desarrollo local

### Prerrequisitos

- Node.js 18+
- Base de datos PostgreSQL (local o Neon)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de base de datos

# Ejecutar en modo desarrollo
npm run dev
```

### Testing de API

```bash
# Health check
curl https://tu-dominio.vercel.app/api/health

# Obtener propiedades
curl https://tu-dominio.vercel.app/api/properties

# Crear nueva propiedad
curl -X POST https://tu-dominio.vercel.app/api/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Property","location":"Test Location","capacity":4}'
```

## 📁 Estructura del proyecto

```
/
├── api/                    # Serverless functions
│   ├── _lib/              # Utilidades compartidas
│   │   ├── db.js          # Conexión a base de datos
│   │   └── upload.js      # Manejo de archivos
│   ├── properties/        # Endpoints de propiedades
│   ├── reservations/      # Endpoints de reservaciones
│   ├── health.js          # Health check
│   └── migrate.js         # Migración de DB
├── src/                   # Frontend React
├── dist/                  # Build del frontend
├── package.json           # Dependencias unificadas
├── vercel.json           # Configuración de Vercel
└── vite.config.js        # Configuración de Vite
```

## 🔌 API Endpoints

### Propiedades
- `GET /api/properties` - Obtener todas las propiedades
- `POST /api/properties` - Crear nueva propiedad
- `GET /api/properties/[id]` - Obtener propiedad específica
- `PUT /api/properties/[id]/approve` - Aprobar propiedad
- `DELETE /api/properties/[id]` - Eliminar propiedad

### Reservaciones
- `GET /api/reservations` - Obtener todas las reservaciones
- `POST /api/reservations` - Crear nueva reservación

### Utilidades
- `GET /api/health` - Health check
- `POST /api/migrate` - Migrar base de datos

## 🔧 Configuración

### Variables de entorno requeridas

```bash
# Base de datos PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Opcional: Variables separadas
PGUSER=your_username
PGPASSWORD=your_password  
PGHOST=your_hostname
PGPORT=5432
PGDATABASE=your_database

# Entorno
NODE_ENV=production
```

## 📝 Notas importantes

1. **CORS**: Configurado para permitir todas las origins en desarrollo
2. **File uploads**: Usando data URLs por simplicidad. Para producción considera Cloudinary/AWS S3
3. **Base de datos**: Sequelize con pool de conexiones optimizado para serverless
4. **Deployment**: Automático desde GitHub via Vercel

## 🐛 Troubleshooting

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la DB en Neon esté activa

### CORS errors
- Los headers CORS están configurados en cada endpoint
- Si persisten, verifica el dominio en production

### Build errors
- Asegúrate de que todas las dependencias estén en `package.json`
- Revisa que no hayan import de módulos ES6 en las API functions