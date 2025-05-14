# Backend de HEZA

## Configuración de la Base de Datos

Este proyecto ha sido actualizado para facilitar la migración y configuración de la base de datos en cualquier entorno, ya sea desarrollo o producción.

### Requisitos Previos

- MySQL 5.7 o superior
- Node.js 14 o superior
- npm 6 o superior

### Configuración Inicial

1. **Crear archivo de variables de entorno**

   Crea una copia del archivo `.env.example` y nómbralo `.env`:

   ```bash
   cp .env.example .env
   ```

2. **Configurar variables de entorno**

   Edita el archivo `.env` con la configuración de tu base de datos:

   ```
   DB_HOST=localhost     # Dirección del servidor MySQL
   DB_PORT=3306          # Puerto del servidor MySQL
   DB_USER=tu_usuario    # Usuario de MySQL
   DB_PASSWORD=tu_clave  # Contraseña de MySQL
   DB_NAME=heza          # Nombre de la base de datos
   LOAD_SAMPLE_DATA=true # Cargar datos de ejemplo (true/false)
   ```

### Inicialización de la Base de Datos

Para inicializar la base de datos de forma automática, ejecuta:

```bash
npm run init-db
```

Este comando realizará las siguientes acciones:

1. Verificará la conexión a MySQL
2. Creará la base de datos si no existe
3. Creará todas las tablas necesarias
4. Cargará datos de ejemplo si `LOAD_SAMPLE_DATA=true`

### Comandos Disponibles

- **Inicializar base de datos**: `npm run init-db`
- **Migrar base de datos**: `npm run migrate`
- **Verificar conexión**: `npm run check-db`
- **Inspeccionar base de datos**: `npm run inspect-db`

### Migración en Entorno de Producción

Para entornos de producción, configura las variables de entorno adecuadamente:

```
NODE_ENV=production
DB_HOST=tu_servidor_produccion
DB_USER=usuario_produccion
DB_PASSWORD=clave_produccion
DB_NAME=heza_produccion
LOAD_SAMPLE_DATA=false  # Normalmente false en producción
```

Luego ejecuta:

```bash
NODE_ENV=production npm run init-db
```

### Solución de Problemas

Si encuentras problemas durante la migración, ejecuta el verificador de conexión:

```bash
npm run check-db
```

Este comando mostrará información detallada sobre la configuración de la base de datos y posibles problemas.

Para más información detallada sobre la migración de la base de datos, consulta el archivo `README_MIGRACION_DB.md`.

## Iniciar el Servidor

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```