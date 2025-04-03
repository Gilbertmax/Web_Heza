```markdown
# Guía de Migración de Base de Datos para el Proyecto HEZA

Esta guía te ayudará a configurar y migrar la base de datos para el proyecto HEZA.

## Requisitos Previos

1. MySQL instalado en tu sistema (versión 5.7 o superior recomendada)
2. Node.js instalado (versión 14 o superior)

## Configuración

1. Crea una copia del archivo `.env.example` y nómbralo `.env`
2. Actualiza la configuración de la base de datos en el archivo `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=heza
LOAD_SAMPLE_DATA=true  # Cambiar a false si no deseas datos de ejemplo
```

## Pasos para la Migración

### Migración Automática

Ejecuta el script de migración:

```bash
npm run migrate
```

Esto realizará lo siguiente:

1. Creará la base de datos si no existe
2. Creará todas las tablas necesarias
3. Cargará datos de ejemplo si LOAD_SAMPLE_DATA está configurado como true

### Migración Manual

Si prefieres ejecutar la migración manualmente:

1. Crea una base de datos llamada 'heza' en MySQL:
   
   ```sql
   CREATE DATABASE IF NOT EXISTS heza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE heza;
   ```

2. Ejecuta el script de esquema:
   
   ```bash
   mysql -u tu_usuario -p heza < src/database/schema.sql
   ```

3. Opcionalmente, ejecuta el script de datos iniciales para cargar información de ejemplo:
   
   ```bash
   mysql -u tu_usuario -p heza < src/database/seed.sql
   ```

## Verificación

Para verificar que la migración fue exitosa:

1. Conéctate a MySQL:
   
   ```bash
   mysql -u tu_usuario -p
   ```

2. Selecciona la base de datos:
   
   ```sql
   USE heza;
   ```

3. Lista todas las tablas:
   
   ```sql
   SHOW TABLES;
   ```

4. Verifica si los datos fueron cargados:
   
   ```sql
   SELECT * FROM users;
   SELECT * FROM services;
   ```

## Solución de Problemas

Si encuentras algún problema durante la migración:

1. Revisa los logs de errores de MySQL
2. Asegúrate que tu usuario de MySQL tenga los privilegios necesarios
3. Verifica que los detalles de conexión en el archivo .env sean correctos
4. Confirma que el servicio de MySQL esté en ejecución

Para asistencia adicional, contacta al equipo de desarrollo.

## 5. Crear un Archivo .env.example

```plaintext:c%3A%5CUsers%5CGilbertoIGS%5CDesktop%5CWeb%5CWeb_Heza%5Cbackend%5C.env.example
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=heza
LOAD_SAMPLE_DATA=true

# Secreto JWT
JWT_SECRET=tu_secreto_jwt_aqui

# Configuración del Servidor
PORT=5000

# Configuración SMTP
SMTP_HOST=mail.ejemplo.com
SMTP_PORT=465
SMTP_USER=tu_email@ejemplo.com
SMTP_PASS=tu_contraseña_email

# URL del Frontend
FRONTEND_URL=http://localhost:3000
```