# Guía de Migración Unificada para Base de Datos HEZA

## Introducción

Este documento proporciona instrucciones para utilizar el nuevo sistema de migración unificada de la base de datos HEZA. Hemos consolidado todos los scripts dispersos en un único archivo siguiendo buenas prácticas de programación para facilitar el mantenimiento y asegurar la consistencia.

## Estructura del Directorio

La carpeta `/database` ahora está organizada de la siguiente manera:

- `migracion_unificada.sql`: Script principal que contiene toda la estructura de la base de datos
- `seed.sql`: Datos iniciales para poblar la base de datos
- `dbManager.js`: Utilidad para gestionar la conexión a la base de datos
- `README_MIGRACION_UNIFICADA.md`: Este documento de instrucciones

## Cambios Realizados

1. **Unificación de Scripts**: Se han combinado los siguientes scripts en `migracion_unificada.sql`:
   - schema.sql
   - noticias.sql
   - solicitudes_acceso.sql
   - verificar_estructura.sql

2. **Mejoras Implementadas**:
   - Organización lógica de las tablas (primero las principales, luego las dependientes)
   - Comentarios descriptivos para cada sección
   - Procedimiento almacenado para verificar la estructura
   - Corrección de inconsistencias entre diferentes scripts
   - Adición de índices para optimizar el rendimiento

3. **Correcciones**:
   - Se agregó la tabla `sucursales` antes de crear referencias a ella
   - Se corrigió la estructura de `solicitudes_acceso` para incluir todos los campos necesarios
   - Se actualizó la tabla `empleados` para incluir relación con `users`
   - Se estandarizaron los nombres de campos y tipos de datos

## Instrucciones de Uso

### Para Ejecutar la Migración Completa

1. **Usando MySQL desde línea de comandos**:
   ```
   mysql -u [usuario] -p < migracion_unificada.sql
   ```

2. **Usando phpMyAdmin**:
   - Accede a phpMyAdmin
   - Selecciona la pestaña "Importar"
   - Selecciona el archivo `migracion_unificada.sql`
   - Haz clic en "Continuar"

### Para Verificar la Estructura

Después de ejecutar la migración, puedes verificar que todo se haya creado correctamente:

```sql
USE heza;
CALL verificar_estructura();
```

Esto mostrará todas las tablas creadas y su estructura.

### Para Cargar Datos Iniciales

Después de la migración, puedes cargar los datos iniciales:

```
mysql -u [usuario] -p heza < seed.sql
```

## Buenas Prácticas para Futuras Modificaciones

1. **No crear scripts separados**: Todas las modificaciones a la estructura deben hacerse en `migracion_unificada.sql`

2. **Documentar cambios**: Añadir comentarios con fecha y descripción de los cambios realizados

3. **Actualizar versión**: Actualizar la fecha de última actualización en el encabezado del script

4. **Probar antes de implementar**: Ejecutar el script completo en un entorno de prueba antes de aplicarlo en producción

5. **Control de versiones**: Mantener el script bajo control de versiones (git)

## Solución de Problemas

Si encuentras algún problema durante la migración:

1. Verifica que MySQL esté correctamente instalado y configurado
2. Asegúrate de tener los permisos necesarios para crear bases de datos y tablas
3. Revisa los logs de error de MySQL para identificar problemas específicos

## Contacto

Si tienes preguntas o encuentras problemas, contacta al equipo de desarrollo.