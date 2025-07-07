# Personal Blog - María Camila Guerrero Roqueme

Blog personal completo con autenticación, gestión de contenido y comunicación HTTPS segura entre frontend y backend.

## 🏗️ Arquitectura del Proyecto

```
Proyecto_Blog/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── context/         # Contextos (Auth)
│   │   ├── services/        # APIs con Axios
│   │   ├── types/           # Tipos TypeScript
│   │   └── data/            # Datos por defecto
│   ├── public/              # Assets estáticos
│   ├── certs/               # Certificados SSL
│   └── package.json
├── backen/                   # Node.js + Express + MongoDB
│   ├── config/              # Configuración DB
│   ├── controllers/         # Lógica de negocio
│   ├── middleware/          # Middlewares
│   ├── models/              # Modelos Mongoose
│   ├── routes/              # Rutas API
│   ├── utils/               # Utilidades
│   ├── certs/               # Certificados SSL
│   └── package.json
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MongoDB Atlas (configurado)
- OpenSSL (para certificados HTTPS)

### 1. Configurar Backend
```bash
cd backen
npm install
# Los certificados HTTPS se generan automáticamente
npm run dev
```

### 2. Configurar Frontend
```bash
cd frontend
npm install
# Los certificados HTTPS se generan automáticamente
npm run dev
```

### 3. Acceder a la Aplicación
- **Frontend:** https://localhost:5173
- **Backend API:** https://localhost:3001/api
- **Health Check:** https://localhost:3001/api/health

## 🔐 Comunicación HTTPS

### Características de Seguridad:
- **Certificados SSL** auto-generados para desarrollo
- **Comunicación encriptada** entre frontend y backend
- **JWT Tokens** para autenticación segura
- **CORS configurado** para dominios específicos
- **Headers de seguridad** implementados
- **Rate limiting** para prevenir ataques

### Configuración HTTPS:
Los certificados se generan automáticamente al iniciar cada servicio:
```bash
# Backend: backen/certs/
# Frontend: frontend/certs/
```

## 🌐 APIs y Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil

### Posts del Blog
- `GET /api/posts` - Obtener todos los posts
- `GET /api/posts/:id` - Obtener post específico
- `POST /api/posts` - Crear nuevo post
- `PUT /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post
- `POST /api/posts/:id/like` - Toggle like

### Actividades
- `GET /api/activities` - Obtener actividades
- `GET /api/activities/categories` - Categorías disponibles
- `POST /api/activities` - Crear actividad
- `PUT /api/activities/:id` - Actualizar actividad
- `DELETE /api/activities/:id` - Eliminar actividad

### Imágenes
- `GET /api/images` - Imágenes del usuario
- `GET /api/images/public` - Imágenes públicas
- `POST /api/images/upload` - Subir imagen
- `DELETE /api/images/:id` - Eliminar imagen

## 🎨 Características del Frontend

### Tecnologías:
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Axios** para comunicación HTTPS
- **Lucide React** para iconos

### Funcionalidades:
- **Diseño responsivo** optimizado para móviles
- **Autenticación completa** con contexto React
- **Dashboard interactivo** para gestión de contenido
- **Modo offline** con contenido por defecto
- **Animaciones suaves** y micro-interacciones
- **Indicadores de conexión** en tiempo real

## 🔧 Características del Backend

### Tecnologías:
- **Node.js** con Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **Multer** para subida de archivos
- **Helmet** para seguridad

### Funcionalidades:
- **API RESTful** completa
- **Autenticación JWT** segura
- **Validación de datos** robusta
- **Manejo de errores** centralizado
- **Logging** detallado
- **Rate limiting** para seguridad

## 📱 Funcionalidades de la Aplicación

### Para Usuarios No Registrados:
- ✅ Visualización de posts por defecto
- ✅ Navegación entre secciones
- ✅ Registro e inicio de sesión
- ✅ Vista de actividades

### Para Usuarios Registrados:
- ✅ **Dashboard completo** para gestión
- ✅ **CRUD de posts** con editor
- ✅ **Gestión de actividades** con categorías
- ✅ **Subida de imágenes** (512x512 PNG)
- ✅ **Perfil editable**
- ✅ **Sistema de likes** en posts
- ✅ **Indicadores de estado** en tiempo real

## 🛠️ Scripts Disponibles

### Backend:
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

### Frontend:
```bash
npm run dev        # Desarrollo con HTTPS
npm run build      # Build para producción
npm run preview    # Preview de producción
npm run dev:full   # Frontend + Backend juntos
```

## 🔒 Seguridad Implementada

### Backend:
- **HTTPS** obligatorio en producción
- **Helmet** para headers de seguridad
- **CORS** configurado específicamente
- **Rate limiting** contra ataques
- **Validación** de entrada de datos
- **JWT** con expiración configurable
- **Hashing** de contraseñas con bcrypt

### Frontend:
- **HTTPS** para todas las comunicaciones
- **Tokens JWT** almacenados de forma segura
- **Validación** de formularios en tiempo real
- **Manejo de errores** específicos
- **Auto-logout** en tokens expirados

## 🌍 Despliegue

### Desarrollo:
1. Ambos servicios usan HTTPS con certificados auto-firmados
2. Frontend: `https://localhost:5173`
3. Backend: `https://localhost:3001`

### Producción:
1. Configurar certificados SSL válidos
2. Actualizar variables de entorno
3. Usar nginx como proxy reverso
4. Configurar dominio y DNS

## 📊 Base de Datos

### MongoDB Atlas:
- **Cluster:** mypersonalblog.jiu416h.mongodb.net
- **Base de datos:** mypersonalblog
- **Colecciones:** users, posts, activities, images

### Modelos:
- **User:** Información de usuarios con roles
- **Post:** Entradas del blog con likes y vistas
- **Activity:** Actividades con categorías y dificultad
- **Image:** Imágenes de personajes en base64

## 🤝 Contribución

Este es un proyecto personal, pero las sugerencias son bienvenidas:

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 👩‍💻 Autora

**María Camila Guerrero Roqueme**
- Email: maria.guerrero@email.com
- Ubicación: Bogotá, Colombia

---

**Desarrollado con ❤️ usando tecnologías modernas y mejores prácticas de seguridad**