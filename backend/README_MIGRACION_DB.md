# Guía de Migración de Base de Datos para HEZA

Esta guía te ayudará a configurar y migrar la base de datos para el proyecto HEZA en diferentes entornos.

## Requisitos Previos

1. MySQL instalado en tu sistema (versión 5.7 o superior recomendada)
2. Node.js instalado (versión 14 o superior)

## Configuración Inicial

### 1. Crear archivo de variables de entorno

Crea una copia del archivo `.env.example` y nómbralo `.env`:

```bash
cp .env.example .env
```

### 2. Configurar variables de entorno

Edita el archivo `.env` con la configuración de tu base de datos:

```
DB_HOST=localhost     # Dirección del servidor MySQL
DB_PORT=3306          # Puerto del servidor MySQL
DB_USER=tu_usuario    # Usuario de MySQL
DB_PASSWORD=tu_clave  # Contraseña de MySQL
DB_NAME=heza          # Nombre de la base de datos
LOAD_SAMPLE_DATA=true # Cargar datos de ejemplo (true/false)
```

## Migración de la Base de Datos

### Migración Automática

Ejecuta el siguiente comando para migrar la base de datos:

```bash
npm run migrate
```

Este comando realizará las siguientes acciones:

1. Creará la base de datos si no existe
2. Creará todas las tablas necesarias según el esquema definido
3. Cargará datos de ejemplo si `LOAD_SAMPLE_DATA=true`

## Solución de Problemas

Si encuentras errores durante la migración, el sistema mostrará mensajes detallados para ayudarte a resolverlos. Aquí hay algunas soluciones comunes:

### Error de conexión

```
Error al conectar a MySQL: Error: connect ECONNREFUSED
```

**Solución**: Verifica que el servidor MySQL esté en ejecución y que la dirección y puerto sean correctos en el archivo `.env`.

### Error de acceso denegado

```
Error al conectar a MySQL: Error: Access denied for user 'usuario'@'localhost'
```

**Solución**: Verifica que el usuario y contraseña de MySQL sean correctos en el archivo `.env`.

### Error de base de datos no encontrada

```
La base de datos 'heza' no existe
```

**Solución**: Ejecuta `npm run migrate` para crear la base de datos automáticamente.

## Migración en Entorno de Producción

Para entornos de producción, sigue estos pasos adicionales:

1. Configura las variables de entorno para producción:

```
NODE_ENV=production
DB_HOST=tu_servidor_produccion
DB_USER=usuario_produccion
DB_PASSWORD=clave_produccion
DB_NAME=heza_produccion
LOAD_SAMPLE_DATA=false  # Normalmente false en producción
```

2. Ejecuta la migración:

```bash
NODE_ENV=production npm run migrate
```

## Notas Importantes

- **Respaldo**: Siempre realiza un respaldo de tu base de datos antes de ejecutar migraciones en entornos de producción.
- **Permisos**: El usuario de MySQL debe tener permisos para crear bases de datos y tablas.
- **Datos de ejemplo**: En entornos de producción, considera establecer `LOAD_SAMPLE_DATA=false` para evitar cargar datos de prueba.

## Estructura de la Base de Datos

La migración crea las siguientes tablas principales:

- `users`: Usuarios del sistema
- `clients`: Clientes registrados
- `documents`: Documentos asociados a clientes
- `events`: Eventos y citas
- `news`: Noticias y actualizaciones

Para más detalles sobre la estructura de la base de datos, consulta el archivo `src/database/schema.sql`.