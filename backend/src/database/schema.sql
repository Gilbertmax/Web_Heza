-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS heza;
USE heza;

-- Eliminar tablas si existen para evitar conflictos
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
DROP TABLE IF EXISTS users;

-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  rol ENUM('admin', 'cliente', 'empleado') NOT NULL DEFAULT 'cliente',
  activo TINYINT(1) DEFAULT 1,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL,
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  original_email VARCHAR(255)
);

-- Tabla de categorías de documentos
CREATE TABLE categorias_documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Tabla de clientes
CREATE TABLE clientes (
  id INT PRIMARY KEY,
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
  id INT PRIMARY KEY,
  puesto VARCHAR(100),
  departamento VARCHAR(100),
  fecha_contratacion DATE
);

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

-- Índices para mejorar el rendimiento
CREATE INDEX idx_documentos_categoria ON documentos(id_categoria);
CREATE INDEX idx_documentos_cliente ON documentos(id_cliente);
CREATE INDEX idx_documentos_empleado ON documentos(id_empleado);
CREATE INDEX idx_diagnosticos_cliente ON diagnosticos(id_cliente);
CREATE INDEX idx_mensajes_remitente ON mensajes(id_remitente);
CREATE INDEX idx_mensajes_destinatario ON mensajes(id_destinatario);
CREATE INDEX idx_galeria_evento ON galeria_eventos(id_evento);