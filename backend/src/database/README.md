# Documentación de Base de Datos HEZA

## Estructura Unificada

Este directorio contiene los archivos necesarios para la gestión de la base de datos del proyecto HEZA. Se ha realizado una unificación de los scripts dispersos para mejorar la organización y seguir buenas prácticas de programación.

## Archivos Principales

### Scripts SQL

- **migracion_unificada.sql**: Script principal que contiene toda la estructura de la base de datos unificada. Este archivo debe ser la única fuente de verdad para la estructura de la base de datos.

- **seed.sql**: Contiene datos iniciales para poblar la base de datos después de crear la estructura.

### Scripts de Utilidad

- **ejecutarMigracion.js**: Permite aplicar la migración completa desde Node.js sin necesidad de usar comandos MySQL directamente.

- **verificarMigracion.js**: Verifica que la estructura de la base de datos sea correcta sin necesidad de MySQL instalado.

- **dbManager.js**: Utilidad para gestionar la conexión a la base de datos desde la aplicación.

## Cómo Utilizar

### Opción 1: Usando Node.js (Recomendado)

1. Asegúrate de tener las variables de entorno configuradas en el archivo `.env` con los datos de conexión a MySQL:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=heza
```

2. Ejecuta el script de migración:

```bash
node ejecutarMigracion.js
```

3. Verifica que la estructura se haya creado correctamente:

```bash
node verificarMigracion.js
```

### Opción 2: Usando MySQL directamente

1. Desde línea de comandos:

```bash
mysql -u [usuario] -p < migracion_unificada.sql
```

2. Para cargar datos iniciales:

```bash
mysql -u [usuario] -p heza < seed.sql
```

## Estructura de la Base de Datos

La base de datos HEZA contiene las siguientes tablas principales:

- **users**: Usuarios del sistema con diferentes roles (admin, cliente, empleado)
- **clientes**: Información de empresas cliente
- **servicios**: Servicios ofrecidos por HEZA
- **eventos**: Eventos programados o pasados
- **noticias**: Noticias y actualizaciones
- **documentos**: Sistema de gestión documental
- **solicitudes_acceso**: Solicitudes de acceso al sistema
- **sucursales**: Sedes o sucursales de la empresa

Para ver la estructura completa y relaciones, consulta el archivo `migracion_unificada.sql`.

## Buenas Prácticas Implementadas

1. **Unificación de scripts**: Todos los scripts dispersos se han consolidado en un único archivo principal.

2. **Organización lógica**: Las tablas se crean en orden lógico (primero las principales, luego las dependientes).

3. **Comentarios descriptivos**: Cada sección del script incluye comentarios explicativos.

4. **Procedimiento de verificación**: Se incluye un procedimiento almacenado para verificar la estructura.

5. **Scripts de utilidad**: Se proporcionan herramientas para facilitar la migración y verificación.

## Mantenimiento

Para futuras modificaciones a la estructura de la base de datos:

1. Actualiza únicamente el archivo `migracion_unificada.sql`
2. Documenta los cambios con comentarios y fecha
3. Actualiza la fecha de última actualización en el encabezado del script
4. Prueba los cambios en un entorno de desarrollo antes de aplicarlos en producción

Para más detalles, consulta el archivo `README_MIGRACION_UNIFICADA.md`.

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