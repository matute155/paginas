# 🚀 Guía de Deployment - React + Serverless en Vercel

## ✅ Migración Completada

Tu proyecto ha sido migrado exitosamente a una estructura serverless compatible con Vercel:

- ✅ Frontend React movido a la raíz
- ✅ Backend convertido a serverless functions en `/api`
- ✅ Configuración de Vercel optimizada
- ✅ Modelos de Sequelize adaptados para serverless
- ✅ Sistema de subida de archivos adaptado
- ✅ CORS configurado correctamente
- ✅ Build de Vite funcionando correctamente

## 📋 Próximos Pasos

### 1. Configurar Neon Database

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Crea una nueva base de datos
3. Copia la connection string que debe verse así:
   ```
   postgresql://username:password@hostname:5432/database?sslmode=require
   ```

### 2. Deploy en Vercel

1. **Conectar repositorio:**
   - Ve a [vercel.com](https://vercel.com) y conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

2. **Configurar variables de entorno:**
   - En tu proyecto de Vercel, ve a Settings > Environment Variables
   - Agrega estas variables:
     ```
     DATABASE_URL=postgresql://username:password@hostname:5432/database?sslmode=require
     NODE_ENV=production
     ```

3. **Deploy:**
   - Haz push a tu repositorio de GitHub
   - Vercel deployará automáticamente

### 3. Migrar la Base de Datos

Después del primer deploy exitoso:

```bash
curl -X POST https://tu-dominio.vercel.app/api/migrate
```

### 4. Verificar que todo funciona

```bash
# Health check
curl https://tu-dominio.vercel.app/api/health

# Test API
curl https://tu-dominio.vercel.app/api/properties
```

## 🔧 Estructura Final del Proyecto

```
/
├── api/                          # Serverless functions
│   ├── _lib/
│   │   ├── db.js                # Conexión a Neon DB
│   │   └── upload.js            # Manejo de archivos
│   ├── properties/
│   │   ├── index.js             # GET/POST /api/properties
│   │   ├── [id].js              # GET/DELETE /api/properties/[id]
│   │   └── [id]/approve.js      # PUT /api/properties/[id]/approve
│   ├── reservations/
│   │   └── index.js             # GET/POST /api/reservations
│   ├── health.js                # Health check
│   └── migrate.js               # Database migration
├── src/                         # Frontend React
├── dist/                        # Built frontend
├── package.json                 # Unified dependencies
├── vercel.json                  # Vercel configuration
├── vite.config.js              # Vite configuration
├── .env.example                # Environment variables template
└── README.md                   # Documentation
```

## 🔌 API Endpoints Disponibles

- `GET /api/health` - Health check
- `POST /api/migrate` - Database migration
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get property by ID
- `PUT /api/properties/[id]/approve` - Approve property
- `DELETE /api/properties/[id]` - Delete property
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation

## 📝 Cambios Importantes

### 1. Base de Datos
- **Antes:** PostgreSQL en Railway con Sequelize
- **Ahora:** PostgreSQL en Neon con Sequelize optimizado para serverless

### 2. Backend
- **Antes:** Servidor Express persistente
- **Ahora:** Serverless functions independientes

### 3. File Uploads
- **Antes:** Multer guardando archivos en `/uploads`
- **Ahora:** Base64 data URLs (temporal)
- **Recomendación:** Migrar a Cloudinary o AWS S3 para producción

### 4. CORS
- **Antes:** Configurado en Express
- **Ahora:** Headers en cada serverless function

## 🔧 Desarrollo Local

Para desarrollo local, las serverless functions no estarán disponibles. Tienes dos opciones:

1. **Usar Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel dev
   ```

2. **Usar solo el frontend:**
   ```bash
   npm run dev
   # Apuntar a tu API en producción para testing
   ```

## 🚨 Troubleshooting

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté correctamente configurada en Vercel
- Asegúrate de que tu DB en Neon esté activa

### CORS errors
- Los headers CORS están configurados en cada endpoint
- Si persisten, verifica que el dominio sea correcto

### Build errors
- Asegúrate de hacer `npm install` antes del build
- Verifica que no haya imports de ES6 modules en las API functions

## ✨ Mejoras Futuras

1. **File uploads:** Integrar con Cloudinary o AWS S3
2. **Authentication:** Añadir JWT para endpoints protegidos
3. **Caching:** Implementar Redis para cache de consultas
4. **Monitoring:** Añadir logging y métricas
5. **Testing:** Añadir tests para las serverless functions

¡Tu proyecto está listo para ser deployado en Vercel! 🎉