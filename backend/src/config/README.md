# Configuración de Base de Datos

## Descripción

Este directorio contiene archivos de configuración para la aplicación, incluyendo la configuración de la base de datos.

## Archivo `db.js`

El archivo `db.js` proporciona un pool de conexiones a la base de datos MySQL que es utilizado por toda la aplicación. Este archivo:

- Carga las variables de entorno desde el archivo `.env`
- Configura un pool de conexiones MySQL con los parámetros adecuados
- Verifica la conexión a la base de datos al iniciar la aplicación
- Proporciona mensajes de error útiles en caso de problemas de conexión

## Integración con el Sistema Unificado de Base de Datos

El archivo `db.js` ahora está integrado con el nuevo sistema unificado de base de datos ubicado en la carpeta `/src/database/`. Esta integración permite:

1. Mantener compatibilidad con el código existente que utiliza el pool de conexiones
2. Aprovechar las funcionalidades avanzadas del sistema unificado para gestión de la base de datos

## Comandos Disponibles

Se han agregado nuevos comandos npm para gestionar la base de datos utilizando el sistema unificado:

- `npm run db:init` - Inicializa la base de datos (verifica conexión y ejecuta migración)
- `npm run db:check` - Verifica la conexión a la base de datos
- `npm run db:migrate` - Ejecuta la migración de la base de datos
- `npm run db:inspect` - Inspecciona la estructura de la base de datos

## Comandos Antiguos (mantenidos por compatibilidad)

Los siguientes comandos siguen funcionando pero se recomienda migrar a los nuevos:

- `npm run migrate` - Ejecuta la migración de la base de datos (utiliza el script antiguo)
- `npm run inspect-db` - Inspecciona la base de datos (utiliza el script antiguo)
- `npm run check-db` - Verifica la conexión (utiliza el script antiguo)
- `npm run init-db` - Inicializa la base de datos (utiliza el script antiguo)

## Notas Importantes

- No es necesario eliminar el archivo `db.js` ya que proporciona el pool de conexiones que utilizan muchos módulos de la aplicación
- Se recomienda utilizar los nuevos comandos `db:*` para gestionar la base de datos
- La lógica principal de gestión de la base de datos ahora está centralizada en `/src/database/dbManager.js`