# Guía Completa para el Proyecto HEZA

Este documento unifica las instrucciones para la configuración y uso del proyecto HEZA, incluyendo la base de datos y el frontend.

## Requisitos Previos

- MySQL 5.7 o superior
- Node.js 14 o superior
- npm 6 o superior

## Configuración de la Base de Datos

1. Crea una copia del archivo `.env.example` y nómbralo `.env`.
2. Edita el archivo `.env` con la configuración de tu base de datos:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_clave
DB_NAME=heza
LOAD_SAMPLE_DATA=true
```

## Inicialización de la Base de Datos

Para inicializar la base de datos de forma automática, ejecuta:

```bash
npm run init-db
```

Este comando realizará las siguientes acciones:

1. Verificará la conexión a MySQL
2. Creará la base de datos si no existe
3. Creará todas las tablas necesarias
4. Cargará datos de ejemplo si `LOAD_SAMPLE_DATA=true`

## Migración de la Base de Datos

Para migrar la base de datos, ejecuta:

```bash
npm run migrate
```

Este comando realizará las siguientes acciones:

1. Creará la base de datos si no existe
2. Creará todas las tablas necesarias
3. Cargará datos de ejemplo si `LOAD_SAMPLE_DATA=true`

## Frontend

Este proyecto fue iniciado con [Create React App](https://github.com/facebook/create-react-app).

### Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm start`: Ejecuta la aplicación en modo desarrollo.
- `npm test`: Lanza el corredor de pruebas.
- `npm run build`: Construye la aplicación para producción.

Para más detalles, consulta la [documentación de Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

## Solución de Problemas

Si encuentras problemas durante la configuración o ejecución, verifica que las variables de entorno estén correctamente configuradas y que el servidor MySQL esté en ejecución.