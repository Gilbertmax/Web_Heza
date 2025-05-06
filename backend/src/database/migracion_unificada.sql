-- ========================================================================
-- SCRIPT DE MIGRACIÓN UNIFICADO PARA LA BASE DE DATOS HEZA
-- ========================================================================
-- Este script unifica todas las migraciones y estructuras de la base de datos
-- en un solo archivo siguiendo buenas prácticas de programación.
-- Última actualización: 2023-11-15

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS heza;
USE heza;

-- ========================================================================
-- ELIMINACIÓN DE TABLAS EXISTENTES (para evitar conflictos)
-- ========================================================================
-- Primero eliminamos tablas con dependencias (claves foráneas)
DROP TABLE IF EXISTS galeria_eventos;
DROP TABLE IF EXISTS mensajes;
DROP TABLE IF EXISTS documentos;
DROP TABLE IF EXISTS diagnosticos;
DROP TABLE IF EXISTS cliente_servicio;
DROP TABLE IF EXISTS empleados;
DROP TABLE IF EXISTS eventos;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS categorias_documentos;
ALTER TABLE galeria_noticias DROP FOREIGN KEY galeria_noticias_ibfk_1;
DROP TABLE IF EXISTS galeria_noticias;
DROP TABLE IF EXISTS noticias;
DROP TABLE IF EXISTS solicitudes_acceso;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sucursales;

-- ========================================================================
-- CREACIÓN DE TABLAS PRINCIPALES
-- ========================================================================

-- Tabla de sucursales
CREATE TABLE sucursales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(100),
  activo TINYINT(1) DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  rol ENUM('admin', 'cliente', 'empleado') NOT NULL DEFAULT 'cliente',
  sede_id INT,
  sucursal VARCHAR(100),
  activo TINYINT(1) DEFAULT 1,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  original_email VARCHAR(255),
  FOREIGN KEY (sede_id) REFERENCES sucursales(id) ON DELETE SET NULL
);

-- Tabla de categorías de documentos
CREATE TABLE categorias_documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Tabla de clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa VARCHAR(100) NOT NULL,
  rfc VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(50),
  estado VARCHAR(50),
  codigo_postal VARCHAR(10),
  giro VARCHAR(100),
  numero_empleados INT,
  ventas_anuales DECIMAL(15,2)
);

-- Tabla de servicios
CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  activo TINYINT(1) DEFAULT 1
);

-- Tabla de eventos
CREATE TABLE eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora TIME,
  ubicacion VARCHAR(255),
  tipo ENUM('Próximo', 'Pasado') DEFAULT 'Próximo',
  imagen VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empleados
CREATE TABLE empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  puesto VARCHAR(100),
  departamento VARCHAR(100),
  fecha_contratacion DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ========================================================================
-- CREACIÓN DE TABLAS DE RELACIÓN Y DEPENDIENTES
-- ========================================================================

-- Tabla de relación cliente-servicio
CREATE TABLE cliente_servicio (
  id_cliente INT NOT NULL,
  id_servicio INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  notas TEXT,
  PRIMARY KEY (id_cliente, id_servicio),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id) ON DELETE CASCADE
);

-- Tabla de diagnósticos
CREATE TABLE diagnosticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uso_contabilidad TINYINT(1),
  manual_cumplimiento TINYINT(1),
  verificacion_mensual TINYINT(1),
  revision_declaraciones TINYINT(1),
  consistencia_sat TINYINT(1),
  carta_responsiva TINYINT(1),
  notas TEXT,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Tabla de documentos
CREATE TABLE documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  ruta_archivo VARCHAR(255) NOT NULL,
  tipo_archivo VARCHAR(50) NOT NULL,
  tamano_archivo INT,
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  id_categoria INT,
  id_cliente INT,
  id_empleado INT,
  FOREIGN KEY (id_categoria) REFERENCES categorias_documentos(id) ON DELETE SET NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE SET NULL,
  FOREIGN KEY (id_empleado) REFERENCES empleados(id) ON DELETE SET NULL
);

-- Tabla de mensajes
CREATE TABLE mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asunto VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_remitente INT NOT NULL,
  id_destinatario INT NOT NULL,
  leido TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_remitente) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_destinatario) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de galería de eventos
CREATE TABLE galeria_eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_evento INT NOT NULL,
  url_imagen VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE
);

-- Tabla de solicitudes de acceso
CREATE TABLE solicitudes_acceso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('client', 'user') NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  rfc VARCHAR(20),
  password VARCHAR(100),
  sede_id INT,
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP NULL,
  estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
  notas TEXT,
  FOREIGN KEY (sede_id) REFERENCES sucursales(id) ON DELETE SET NULL
);

-- Tabla de noticias
CREATE TABLE noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  fecha DATE NOT NULL,
  imagen VARCHAR(255),
  imagenes TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 1. Primero eliminar (sin alterar claves que no existen)
DROP TABLE IF EXISTS galeria_noticias;

-- 2. Luego crear la tabla completa
CREATE TABLE galeria_noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255),
  imagen_url TEXT,
  fecha DATE,
  noticia_id INT,
  -- otros campos si aplica
  INDEX (noticia_id)
);

-- 3. Luego agregar la relación si es necesario (por ejemplo con tabla noticias)
ALTER TABLE galeria_noticias
  ADD CONSTRAINT galeria_noticias_ibfk_1 FOREIGN KEY (noticia_id)
  REFERENCES noticias(id)
  ON DELETE CASCADE;


-- ========================================================================
-- CREACIÓN DE ÍNDICES PARA OPTIMIZACIÓN
-- ========================================================================

-- Índices para la tabla de documentos
CREATE INDEX idx_documentos_categoria ON documentos(id_categoria);
CREATE INDEX idx_documentos_cliente ON documentos(id_cliente);
CREATE INDEX idx_documentos_empleado ON documentos(id_empleado);

-- Índices para la tabla de diagnósticos
CREATE INDEX idx_diagnosticos_cliente ON diagnosticos(id_cliente);

-- Índices para la tabla de mensajes
CREATE INDEX idx_mensajes_remitente ON mensajes(id_remitente);
CREATE INDEX idx_mensajes_destinatario ON mensajes(id_destinatario);

-- Índices para la tabla de galería de eventos
CREATE INDEX idx_galeria_evento ON galeria_eventos(id_evento);

-- Índices para la tabla de solicitudes de acceso
CREATE INDEX idx_solicitudes_estado ON solicitudes_acceso(estado);
CREATE INDEX idx_solicitudes_tipo ON solicitudes_acceso(tipo);
CREATE INDEX idx_solicitudes_fecha ON solicitudes_acceso(fecha_solicitud);

-- Índices para la tabla de noticias
CREATE INDEX idx_noticias_fecha ON noticias(fecha);

-- ========================================================================
-- PROCEDIMIENTO PARA VERIFICAR LA ESTRUCTURA DE LA BASE DE DATOS
-- ========================================================================

CREATE PROCEDURE IF NOT EXISTS verificar_estructura()
BEGIN
    -- Mostrar todas las tablas en la base de datos
    SELECT 'Lista de tablas en la base de datos:' AS 'Información';
    SHOW TABLES;
    
    -- Verificar que todas las tablas necesarias existen
    SELECT 
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'users') THEN 'Existe' ELSE 'No existe' END AS 'Tabla users',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'clientes') THEN 'Existe' ELSE 'No existe' END AS 'Tabla clientes',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'servicios') THEN 'Existe' ELSE 'No existe' END AS 'Tabla servicios',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'eventos') THEN 'Existe' ELSE 'No existe' END AS 'Tabla eventos',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'noticias') THEN 'Existe' ELSE 'No existe' END AS 'Tabla noticias',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'documentos') THEN 'Existe' ELSE 'No existe' END AS 'Tabla documentos',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'mensajes') THEN 'Existe' ELSE 'No existe' END AS 'Tabla mensajes',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'solicitudes_acceso') THEN 'Existe' ELSE 'No existe' END AS 'Tabla solicitudes_acceso',
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'heza' AND table_name = 'sucursales') THEN 'Existe' ELSE 'No existe' END AS 'Tabla sucursales';
    
    -- Mostrar estructura de tablas principales
    SELECT 'Estructura de la tabla users:' AS 'Información';
    DESCRIBE users;
    
    SELECT 'Estructura de la tabla clientes:' AS 'Información';
    DESCRIBE clientes;
    
    SELECT 'Estructura de la tabla noticias:' AS 'Información';
    DESCRIBE noticias;
    
    SELECT 'Estructura de la tabla solicitudes_acceso:' AS 'Información';
    DESCRIBE solicitudes_acceso;
    
    SELECT 'Estructura de la tabla sucursales:' AS 'Información';
    DESCRIBE sucursales;
END;

-- Eliminar referencias a scripts antiguos
DROP PROCEDURE IF EXISTS verificar_estructura_anterior;

-- ========================================================================
-- COMENTARIOS FINALES
-- ========================================================================
-- Para ejecutar este script completo:
-- 1. Desde línea de comandos: mysql -u [usuario] -p < migracion_unificada.sql
-- 2. Desde phpMyAdmin: Importar este archivo
--
-- Para verificar la estructura después de la migración:
-- CALL verificar_estructura();
--
-- Nota: Este script unifica todas las migraciones anteriores y debe ser
-- la única fuente de verdad para la estructura de la base de datos.