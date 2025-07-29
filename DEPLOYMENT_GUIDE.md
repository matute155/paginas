# Guía de Despliegue: Vercel + Railway

Este proyecto está configurado para desplegarse con el frontend en **Vercel** y el backend en **Railway**.

## 📁 Estructura del Proyecto

```
├── frontend/          # React + Vite (Vercel)
├── backend/           # Node.js + Express + Sequelize (Railway)
├── backend/Dockerfile # Configuración Docker para Railway
└── DEPLOYMENT_GUIDE.md
```

## 🚀 Despliegue del Backend en Railway

### 1. Preparación
1. Ve a [Railway.app](https://railway.app) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Crea un nuevo proyecto en Railway

### 2. Configuración de la Base de Datos
1. En Railway, agrega un servicio de **PostgreSQL**
2. Railway generará automáticamente la variable `DATABASE_URL`

### 3. Variables de Entorno en Railway
Configura estas variables en Railway:

```bash
# Obligatorias
PORT=8080
NODE_ENV=production
DATABASE_URL=postgresql://... # Auto-generada por Railway

# Opcional pero recomendada
FRONTEND_URL=https://tu-app.vercel.app
```

### 4. Despliegue
1. Railway detectará automáticamente el `Dockerfile`
2. El build se ejecutará automáticamente
3. El health check estará disponible en `/health`

## 🌐 Despliegue del Frontend en Vercel

### 1. Preparación
1. Ve a [Vercel.com](https://vercel.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Selecciona la carpeta `frontend` como directorio raíz

### 2. Configuración de Build en Vercel
Vercel debería detectar automáticamente la configuración de `vercel.json`, pero verifica:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Variables de Entorno en Vercel
```bash
# Opcional
VITE_API_URL=https://tu-backend.up.railway.app
```

### 4. Actualizar la URL del Backend
En `frontend/vercel.json`, actualiza la URL de Railway:
```json
"destination": "https://TU-BACKEND.up.railway.app/api/:path*"
```

## 🔧 Configuraciones Importantes

### CORS
El backend está configurado para aceptar:
- Dominios específicos en `allowedOrigins`
- Todos los dominios `*.vercel.app`
- La variable `FRONTEND_URL`

### Health Check
- **Endpoint**: `/health`
- **Método**: GET, POST, PUT, DELETE, OPTIONS
- **Respuesta**: `{"status": "ok"}`

### Base de Datos
- Configurada para usar `DATABASE_URL` (Railway)
- Fallback a configuración individual para desarrollo local
- SSL habilitado para producción

## 📝 Comandos de Desarrollo

### Frontend
```bash
cd frontend
npm install
npm run dev     # Desarrollo
npm run build   # Build para producción
npm run start   # Preview del build
```

### Backend
```bash
cd backend
npm install
npm run dev     # Desarrollo
npm start       # Producción
```

## 🔍 Verificación del Despliegue

1. **Backend Health Check**: `https://tu-backend.up.railway.app/health`
2. **Frontend**: `https://tu-app.vercel.app`
3. **API desde Frontend**: Verifica que las llamadas a `/api/*` funcionen

## 🚨 Troubleshooting

### Error de CORS
- Verifica que `FRONTEND_URL` esté configurada en Railway
- Asegúrate de que el dominio de Vercel esté en `allowedOrigins`

### Error de Base de Datos
- Verifica que `DATABASE_URL` esté configurada
- Comprueba que el servicio PostgreSQL esté ejecutándose en Railway

### Error de Build
- Verifica que todas las dependencias estén en `package.json`
- Comprueba los logs de build en Railway/Vercel

## 📋 Lista de Verificación Final

- [ ] Backend desplegado en Railway
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas en Railway
- [ ] Health check `/health` responde correctamente
- [ ] Frontend desplegado en Vercel
- [ ] URL del backend actualizada en `vercel.json`
- [ ] CORS funcionando correctamente
- [ ] API calls funcionando desde el frontend