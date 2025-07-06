# Backend del Blog Personal

Este es el backend completo para el blog personal de María Camila Guerrero Roqueme, desarrollado con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación JWT** - Sistema completo de registro y login
- **Gestión de Posts** - CRUD completo para entradas del blog
- **Gestión de Actividades** - Manejo de actividades académicas y personales
- **Gestión de Imágenes** - Subida y manejo de imágenes de personajes
- **Seguridad** - Implementación de mejores prácticas de seguridad
- **Validación** - Validación robusta de datos de entrada
- **Logging** - Sistema de logs para monitoreo
- **Rate Limiting** - Protección contra ataques de fuerza bruta

## 📁 Estructura del Proyecto

```
backen/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── postController.js    # Lógica de posts
│   ├── activityController.js # Lógica de actividades
│   └── imageController.js   # Lógica de imágenes
├── middleware/
│   ├── auth.js             # Middleware de autenticación
│   ├── validation.js       # Middleware de validación
│   └── upload.js           # Middleware de subida de archivos
├── models/
│   ├── User.js             # Modelo de usuario
│   ├── Post.js             # Modelo de post
│   ├── Activity.js         # Modelo de actividad
│   └── Image.js            # Modelo de imagen
├── routes/
│   ├── auth.js             # Rutas de autenticación
│   ├── posts.js            # Rutas de posts
│   ├── activities.js       # Rutas de actividades
│   └── images.js           # Rutas de imágenes
├── utils/
│   ├── logger.js           # Sistema de logging
│   └── responseHelper.js   # Helpers para respuestas
├── .env                    # Variables de entorno
├── server.js               # Archivo principal del servidor
└── package.json            # Dependencias y scripts
```

## 🛠️ Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   cd backen
   npm install
   ```

2. **Configurar variables de entorno:**
   El archivo `.env` ya está configurado con los valores necesarios.

3. **Iniciar el servidor:**
   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm start
   ```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/profile` - Obtener perfil (requiere auth)
- `PUT /api/auth/profile` - Actualizar perfil (requiere auth)

### Posts
- `GET /api/posts` - Obtener todos los posts
- `GET /api/posts/:id` - Obtener post por ID
- `POST /api/posts` - Crear nuevo post (requiere auth)
- `PUT /api/posts/:id` - Actualizar post (requiere auth)
- `DELETE /api/posts/:id` - Eliminar post (requiere auth)
- `POST /api/posts/:id/like` - Toggle like en post (requiere auth)

### Actividades
- `GET /api/activities` - Obtener todas las actividades
- `GET /api/activities/:id` - Obtener actividad por ID
- `GET /api/activities/categories` - Obtener categorías disponibles
- `POST /api/activities` - Crear nueva actividad (requiere auth)
- `PUT /api/activities/:id` - Actualizar actividad (requiere auth)
- `DELETE /api/activities/:id` - Eliminar actividad (requiere auth)

### Imágenes
- `GET /api/images` - Obtener imágenes del usuario (requiere auth)
- `GET /api/images/:id` - Obtener imagen por ID (requiere auth)
- `GET /api/images/public` - Obtener imágenes públicas
- `POST /api/images/upload` - Subir nueva imagen (requiere auth)
- `PUT /api/images/:id` - Actualizar imagen (requiere auth)
- `DELETE /api/images/:id` - Eliminar imagen (requiere auth)

### Utilidades
- `GET /api/health` - Estado del servidor

## 🔒 Seguridad

- **JWT Authentication** - Tokens seguros para autenticación
- **Helmet** - Headers de seguridad HTTP
- **Rate Limiting** - Protección contra ataques de fuerza bruta
- **CORS** - Configuración segura de CORS
- **Validación** - Validación robusta de entrada de datos
- **Hashing** - Contraseñas hasheadas con bcrypt

## 📊 Base de Datos

El backend utiliza MongoDB con Mongoose como ODM. Los modelos incluyen:

- **User** - Información de usuarios
- **Post** - Entradas del blog
- **Activity** - Actividades académicas/personales
- **Image** - Imágenes de personajes

## 🔧 Configuración de Desarrollo

Para desarrollo, el servidor incluye:
- **Nodemon** - Recarga automática en cambios
- **Morgan** - Logging de requests HTTP
- **Logs detallados** - Sistema de logging completo

## 🚀 Despliegue

Para producción:
1. Configurar variables de entorno apropiadas
2. Usar `npm start` para iniciar el servidor
3. Configurar proxy reverso (nginx recomendado)
4. Configurar SSL/TLS

## 📝 Logs

Los logs se guardan en la carpeta `logs/`:
- `app.log` - Logs generales
- `error.log` - Logs de errores
- `debug.log` - Logs de debug (solo en desarrollo)

## 🤝 Contribución

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.