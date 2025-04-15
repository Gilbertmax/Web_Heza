-- Script para crear la tabla de solicitudes de acceso
USE heza;

-- Crear tabla de solicitudes de acceso si no existe
CREATE TABLE IF NOT EXISTS solicitudes_acceso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('client', 'user') NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  rfc VARCHAR(20),
  password VARCHAR(100),
  sucursal VARCHAR(50),
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
  notas TEXT
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_solicitudes_estado ON solicitudes_acceso(estado);
CREATE INDEX idx_solicitudes_tipo ON solicitudes_acceso(tipo);
CREATE INDEX idx_solicitudes_fecha ON solicitudes_acceso(fecha_solicitud);