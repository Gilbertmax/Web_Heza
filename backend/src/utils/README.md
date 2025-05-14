# Utilidades del Sistema HEZA

Este directorio contiene scripts y utilidades para el funcionamiento del sistema HEZA.

## Estructura de Archivos

### Utilidades de Base de Datos

> **NOTA IMPORTANTE**: Las funcionalidades de gestión de base de datos han sido centralizadas en el directorio `../database/dbManager.js`. Se recomienda utilizar ese módulo para todas las operaciones relacionadas con la base de datos.

Los siguientes archivos se mantienen por compatibilidad, pero se recomienda migrar a las nuevas funciones:

- `checkDatabaseConnection.js`: Verifica la conexión a la base de datos (usar `../database/dbManager.js` en su lugar)
- `initializeDatabase.js`: Inicializa la base de datos (usar `../database/dbManager.js` en su lugar)
- `migrateDatabase.js`: Ejecuta la migración de la base de datos (usar `../database/dbManager.js` en su lugar)
- `inspectDatabase.js`: Inspecciona la estructura de la base de datos (usar `../database/dbManager.js` en su lugar)

### Utilidades de Correo Electrónico

- `emailService.js`: Servicio para el envío de correos electrónicos
- `debugEmailService.js`: Herramienta para depurar el servicio de correo electrónico

### Utilidades de Imágenes

- `imageHelpers.js`: Funciones auxiliares para el procesamiento de imágenes

### Utilidades de Usuarios

- `cleanupUsers.js`: Script para limpiar usuarios inactivos o duplicados
- `updateAdminPassword.js`: Herramienta para actualizar la contraseña del administrador

## Uso de las Utilidades

### Correo Electrónico

Para enviar correos electrónicos, utiliza el servicio de correo electrónico:

```javascript
import emailService from './utils/emailService.js';

await emailService.sendEmail({
  to: 'destinatario@ejemplo.com',
  subject: 'Asunto del correo',
  text: 'Contenido del correo en texto plano',
  html: '<p>Contenido del correo en HTML</p>'
});
```

### Imágenes

Para procesar imágenes, utiliza las funciones auxiliares de imágenes:

```javascript
import { resizeImage, optimizeImage } from './utils/imageHelpers.js';

// Redimensionar una imagen
const resizedImageBuffer = await resizeImage(originalImageBuffer, 800, 600);

// Optimizar una imagen
const optimizedImageBuffer = await optimizeImage(imageBuffer);
```

## Migración a la Nueva Estructura

Se recomienda migrar gradualmente a la nueva estructura centralizada de gestión de base de datos:

1. Para nuevos desarrollos, utiliza siempre `../database/dbManager.js`
2. Para código existente, considera actualizar las importaciones:

```javascript
// Antes
import initializeDatabase from './utils/initializeDatabase.js';

// Después
import { initializeDatabase } from './database/dbManager.js';
```

Esto permitirá mantener una estructura más organizada y evitar redundancias en el código.