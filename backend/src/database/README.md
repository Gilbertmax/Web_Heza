# Gestión de Base de Datos HEZA

Este directorio contiene los archivos necesarios para la gestión de la base de datos del sistema HEZA.

## Estructura de Archivos

### Archivos SQL

- `schema.sql`: Contiene la estructura de la base de datos (tablas, índices, etc.)
- `seed.sql`: Contiene datos de ejemplo para poblar la base de datos
- `solicitudes_acceso.sql`: Script específico para la tabla de solicitudes de acceso

### Archivos JavaScript

- `dbManager.js`: Módulo centralizado que contiene todas las funciones para gestionar la base de datos
- `dbScript.js`: Script ejecutable para interactuar con las funciones de dbManager desde la línea de comandos
- `seedData.js`: Script para cargar datos de prueba adicionales

## Uso del Sistema de Base de Datos

### Configuración

La configuración de la base de datos se realiza a través del archivo `.env` en la raíz del proyecto. Este archivo contiene las siguientes variables:

```
# Configuración de Base de Datos (Desarrollo)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=heza
LOAD_SAMPLE_DATA=true
```

### Comandos Disponibles

Puedes utilizar el script `dbScript.js` para gestionar la base de datos:

```bash
# Inicializar la base de datos (verificar conexión y ejecutar migración)
node src/database/dbScript.js init

# Verificar la conexión a la base de datos
node src/database/dbScript.js check

# Ejecutar la migración de la base de datos
node src/database/dbScript.js migrate

# Inspeccionar la estructura de la base de datos
node src/database/dbScript.js inspect
```

## Funcionalidades Principales

### Inicialización de Base de Datos

La función `initializeDatabase()` realiza las siguientes acciones:

1. Verifica la conexión a la base de datos
2. Crea la base de datos si no existe
3. Crea las tablas definidas en `schema.sql` si no existen
4. Carga datos de ejemplo desde `seed.sql` si `LOAD_SAMPLE_DATA=true`

### Verificación de Conexión

La función `checkDatabaseConnection()` verifica:

1. La conexión al servidor MySQL
2. La existencia de la base de datos
3. Las tablas existentes en la base de datos

### Migración de Base de Datos

La función `migrateDatabase()` se encarga de:

1. Crear la base de datos si no existe
2. Ejecutar el script de esquema para crear las tablas
3. Cargar datos de ejemplo si está configurado

### Inspección de Base de Datos

La función `inspectDatabase()` muestra información detallada sobre:

1. Las tablas existentes en la base de datos
2. La estructura de cada tabla (columnas, tipos, etc.)
3. El número de registros en cada tabla
4. Ejemplos de datos en cada tabla

## Notas Importantes

- Todos los scripts verifican primero la existencia de las estructuras antes de crearlas para evitar pérdida de datos
- La carga de datos de ejemplo solo se realiza si `LOAD_SAMPLE_DATA=true` en el archivo `.env`
- En entorno de producción, se recomienda establecer `LOAD_SAMPLE_DATA=false`