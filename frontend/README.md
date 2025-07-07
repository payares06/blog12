# Personal Blog Frontend

Frontend moderno y responsivo para el blog personal de María Camila Guerrero Roqueme, desarrollado con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

- **React 18** con TypeScript para un desarrollo robusto
- **Vite** para desarrollo rápido y builds optimizados
- **Tailwind CSS** para estilos modernos y responsivos
- **Axios** para comunicación HTTPS con el backend
- **Autenticación JWT** completa con contexto React
- **Dashboard** interactivo para gestión de contenido
- **Diseño responsivo** optimizado para móviles y desktop
- **Animaciones suaves** y micro-interacciones
- **Modo offline** con fallback a contenido estático
- **HTTPS** configurado para desarrollo seguro

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── Header.tsx       # Navegación principal
│   │   ├── AuthModal.tsx    # Modal de autenticación
│   │   ├── BlogPost.tsx     # Componente de post
│   │   ├── Dashboard.tsx    # Panel de administración
│   │   ├── ActivityView.tsx # Vista de actividades
│   │   └── Footer.tsx       # Pie de página
│   ├── context/
│   │   └── AuthContext.tsx  # Contexto de autenticación
│   ├── services/
│   │   └── api.ts          # Cliente Axios y APIs
│   ├── types/
│   │   └── index.ts        # Definiciones TypeScript
│   ├── data/
│   │   └── blogPosts.ts    # Datos por defecto
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── certs/                  # Certificados SSL para desarrollo
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar HTTPS (automático):**
   Los certificados SSL se generan automáticamente para desarrollo local.

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `https://localhost:5173`

4. **Iniciar frontend y backend juntos:**
   ```bash
   npm run dev:full
   ```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con HTTPS
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run dev:full` - Inicia frontend y backend simultáneamente

## 🌐 Comunicación con el Backend

El frontend se comunica con el backend a través de HTTPS usando Axios:

- **Desarrollo:** `https://localhost:3001/api`
- **Producción:** `https://api.mariacamilablog.com`

### Características de la API:

- **Interceptores de request** para agregar tokens JWT automáticamente
- **Interceptores de response** para manejo centralizado de errores
- **Manejo de errores** con mensajes descriptivos
- **Timeout configurado** para evitar requests colgados
- **Soporte para certificados auto-firmados** en desarrollo

## 🎨 Diseño y UX

### Paleta de Colores:
- **Primario:** Teal (#14B8A6)
- **Secundario:** Emerald (#10B981)
- **Fondo:** Beige (#F5F5DC)
- **Texto:** Grises variados

### Características de Diseño:
- **Responsive Design** con breakpoints optimizados
- **Animaciones CSS** suaves y profesionales
- **Micro-interacciones** en botones y elementos
- **Tipografía** clara con Inter como fuente principal
- **Bordes negros** para un estilo distintivo
- **Gradientes** sutiles para elementos destacados

## 🔐 Autenticación y Seguridad

- **JWT Tokens** almacenados en localStorage
- **Contexto React** para estado de autenticación global
- **Rutas protegidas** para el dashboard
- **Validación de formularios** en tiempo real
- **Manejo de errores** específicos por tipo
- **Auto-logout** en caso de token expirado

## 📱 Funcionalidades

### Para Usuarios No Autenticados:
- Visualización de posts por defecto
- Navegación entre secciones
- Registro e inicio de sesión
- Vista de actividades estáticas

### Para Usuarios Autenticados:
- **Dashboard completo** para gestión de contenido
- **CRUD de posts** con editor visual
- **Gestión de actividades** con categorías y dificultad
- **Subida de imágenes** con validación
- **Perfil de usuario** editable
- **Like en posts** con actualización en tiempo real

## 🚀 Optimizaciones

- **Code Splitting** automático con Vite
- **Tree Shaking** para bundles optimizados
- **Lazy Loading** de imágenes
- **Compresión** de assets
- **Cache de API** para mejor rendimiento
- **Modo offline** con contenido estático

## 🔧 Desarrollo

### Tecnologías Utilizadas:
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **ESLint** - Linting de código

### Mejores Prácticas:
- **Componentes funcionales** con hooks
- **TypeScript estricto** para type safety
- **Separación de responsabilidades** clara
- **Manejo de errores** robusto
- **Código limpio** y bien documentado

## 🌍 Despliegue

Para producción:

1. **Build de la aplicación:**
   ```bash
   npm run build
   ```

2. **Configurar variables de entorno** para producción

3. **Servir archivos estáticos** con servidor web (nginx recomendado)

4. **Configurar HTTPS** con certificados válidos

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ por María Camila Guerrero Roqueme**