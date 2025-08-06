# 🚀 Deployment Guide - DesdeAca.com

Esta guía te ayudará a desplegar la plataforma DesdeAca.com en producción usando Vercel y Neon.tech (PostgreSQL).

## 📋 Prerrequisitos

1. **Cuenta en Vercel** - [vercel.com](https://vercel.com)
2. **Cuenta en Neon.tech** - [neon.tech](https://neon.tech) (PostgreSQL gratuito)
3. **Código fuente** - Este repositorio
4. **Git** - Para deployment automático

## 🗄️ 1. Configurar Base de Datos (Neon.tech)

### Paso 1: Crear proyecto en Neon.tech
1. Ve a [console.neon.tech](https://console.neon.tech)
2. Click en "Create a project"
3. Nombre: `desdeaca-production`
4. Región: Selecciona la más cercana a tus usuarios
5. PostgreSQL Version: 15 (recomendado)

### Paso 2: Obtener string de conexión
1. En tu dashboard de Neon, ve a "Connection Details"
2. Copia la **Database URL** completa
3. Debería verse así:
   ```
   postgres://username:password@ep-xyz-123.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Paso 3: Configurar base de datos
```bash
# Opcional: Ejecutar localmente para poblar con datos de ejemplo
npm install
export DATABASE_URL="tu-connection-string-aqui"
npm run seed
```

## 🚀 2. Desplegar en Vercel

### Opción A: Deployment desde GitHub (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - DesdeAca platform"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Selecciona tu repositorio de GitHub
   - Framework Preset: `Vite`
   - Root Directory: `./` (raíz)

3. **Configurar Variables de Entorno**
   En Vercel Project Settings → Environment Variables, agrega:
   ```
   DATABASE_URL=postgres://username:password@ep-xyz.neon.tech/dbname?sslmode=require
   JWT_SECRET=tu-secreto-jwt-super-seguro-aqui
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automáticamente construirá y desplegará tu app

### Opción B: Deployment directo con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Configurar proyecto
vercel

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Deploy
vercel --prod
```

## 🔧 3. Configuración de Variables de Entorno

### Variables Requeridas
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string de PostgreSQL | `postgres://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Clave secreta para JWT (mínimo 32 caracteres) | `tu-super-secreto-jwt-key-aqui` |
| `NODE_ENV` | Entorno de ejecución | `production` |

### Generar JWT Secret seguro
```bash
# Opción 1: OpenSSL
openssl rand -hex 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 4. Verificar Deployment

### Endpoints a probar:
1. **Frontend**: `https://tu-app.vercel.app`
2. **API Health Check**: `https://tu-app.vercel.app/api/properties`
3. **Registro de usuario**: `https://tu-app.vercel.app/api/users?action=register`

### Pruebas básicas:
```bash
# Verificar que la API responde
curl https://tu-app.vercel.app/api/properties

# Registrar usuario de prueba
curl -X POST https://tu-app.vercel.app/api/users?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@desdeaca.com",
    "password": "test123",
    "name": "Usuario Test",
    "user_type": "guest"
  }'
```

## 🔄 5. Configurar CI/CD Automático

### Con GitHub Actions (Opcional)
Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 6. Monitoreo y Logs

### Ver logs en Vercel:
1. Ve a tu proyecto en Vercel Dashboard
2. Pestaña "Functions" → Ver logs de API
3. Pestaña "Deployments" → Ver logs de build

### Monitorear base de datos:
1. Dashboard de Neon.tech
2. Métricas de CPU, memoria y conexiones
3. Query monitoring

## 🔒 7. Seguridad en Producción

### Checklist de seguridad:
- [ ] JWT_SECRET es fuerte y único
- [ ] DATABASE_URL no está expuesta en el código
- [ ] CORS configurado correctamente
- [ ] Rate limiting implementado (futuro)
- [ ] HTTPS habilitado (automático en Vercel)
- [ ] Validación de datos en todas las APIs

### Variables que NO deben estar en el código:
❌ Nunca commits:
- Contraseñas de base de datos
- JWT secrets
- API keys
- Tokens de WhatsApp

## 🔧 8. Troubleshooting

### Problemas comunes:

#### Error de conexión a la base de datos
```
Error: connect ECONNREFUSED
```
**Solución**: Verificar que DATABASE_URL está configurada correctamente en Vercel.

#### Error 500 en APIs
```
Internal Server Error
```
**Solución**: Revisar logs en Vercel Dashboard → Functions.

#### Error de CORS
```
Access to fetch blocked by CORS policy
```
**Solución**: Verificar configuración en `vercel.json`.

#### JWT Token inválido
```
JsonWebTokenError: invalid token
```
**Solución**: Verificar que JWT_SECRET es el mismo en todos los deployments.

## 📞 9. Soporte y Mantenimiento

### Comandos útiles para mantenimiento:
```bash
# Ver logs en tiempo real
vercel logs [deployment-url]

# Re-deploy rápido
vercel --prod

# Verificar configuración
vercel env ls
```

### Backup de base de datos:
Neon.tech hace backups automáticos, pero puedes hacer backups manuales:
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

## 🎯 10. Siguiente Pasos

Una vez desplegado exitosamente:

1. **Configurar dominio personalizado** en Vercel
2. **Configurar SSL** (automático en Vercel)
3. **Configurar Google Analytics** para métricas
4. **Implementar Cloudinary** para manejo de imágenes
5. **Configurar WhatsApp Business API** para funciones avanzadas
6. **Implementar sistema de reviews** para propiedades
7. **Agregar sistema de notificaciones**

---

¡Tu plataforma DesdeAca.com está lista para funcionar! 🏠✨

Para soporte adicional, revisa la documentación en el README.md o abre un issue en el repositorio.