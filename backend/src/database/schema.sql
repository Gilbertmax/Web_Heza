-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS heza;
USE heza;

-- Users table (base table for all user types)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  rol ENUM('admin', 'cliente', 'empleado') NOT NULL DEFAULT 'cliente',
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_conexion TIMESTAMP NULL
);

-- Clientes table (extends users)
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
  ventas_anuales DECIMAL(15,2),
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Empleados table (extends users)
CREATE TABLE empleados (
  id INT PRIMARY KEY,
  puesto VARCHAR(100),
  departamento VARCHAR(100),
  fecha_contratacion DATE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categorias de documentos
CREATE TABLE categorias_documentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Documentos
CREATE TABLE documentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
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
  FOREIGN KEY (id_categoria) REFERENCES categorias_documentos(id),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id),
  FOREIGN KEY (id_empleado) REFERENCES empleados(id)
);

-- Servicios
CREATE TABLE servicios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

-- Relación cliente-servicio
CREATE TABLE cliente_servicio (
  id_cliente INT,
  id_servicio INT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  notas TEXT,
  PRIMARY KEY (id_cliente, id_servicio),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id),
  FOREIGN KEY (id_servicio) REFERENCES servicios(id)
);

-- Eventos
CREATE TABLE eventos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora TIME,
  ubicacion VARCHAR(255),
  tipo ENUM('Próximo', 'Pasado') DEFAULT 'Próximo',
  imagen VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Galería de imágenes para eventos
CREATE TABLE galeria_eventos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_evento INT NOT NULL,
  url_imagen VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE
);

-- Mensajes
CREATE TABLE mensajes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asunto VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_remitente INT NOT NULL,
  id_destinatario INT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_remitente) REFERENCES users(id),
  FOREIGN KEY (id_destinatario) REFERENCES users(id)
);

-- Diagnósticos empresariales
CREATE TABLE diagnosticos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_cliente INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uso_contabilidad BOOLEAN,
  manual_cumplimiento BOOLEAN,
  verificacion_mensual BOOLEAN,
  revision_declaraciones BOOLEAN,
  consistencia_sat BOOLEAN,
  carta_responsiva BOOLEAN,
  notas TEXT,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

-- Datos iniciales para categorías de documentos
INSERT INTO categorias_documentos (nombre, descripcion) VALUES
('Facturación', 'Documentos relacionados con facturas y comprobantes fiscales'),
('Contratos', 'Contratos y acuerdos legales'),
('Estados Financieros', 'Balances, estados de resultados y otros reportes financieros'),
('Nóminas', 'Documentos relacionados con pagos de nómina'),
('Impuestos', 'Declaraciones y documentos fiscales'),
('Legal', 'Documentos legales y corporativos'),
('Administrativo', 'Documentos administrativos generales');

-- Datos iniciales para servicios
INSERT INTO servicios (nombre, descripcion) VALUES
('Diagnóstico Empresarial', 'Evaluación integral de la situación fiscal y financiera de la empresa'),
('Asesoría Fiscal', 'Consultoría especializada en materia fiscal y tributaria'),
('Contabilidad', 'Servicios de contabilidad general y especializada'),
('Asesoría Laboral y Seguro Social', 'Consultoría en temas laborales y de seguridad social'),
('Finanzas Corporativas', 'Servicios de gestión financiera para empresas'),
('Legal Corporativo', 'Asesoría legal para empresas'),
('Consultoría y Consejos Consultivos', 'Servicios de consultoría estratégica'),
('Protección Patrimonial', 'Servicios para proteger el patrimonio empresarial y personal');

-- Crear usuario administrador inicial
INSERT INTO users (nombre, email, password, rol, telefono)
VALUES ('Administrador', 'AdminHeza', '$2b$10$X7VYHy.uOgA.j8Vl4vF9s.v8MV1hFZhF5nUr5kJJRsP/x8bqR6h4e', 'admin', '5551234567');
-- Nota: La contraseña es 'es3Hm3f9y&CdoxVcLruS@VCurrent' hasheada con bcrypt (este hash se actualizará al ejecutar seedData.js)

-- Add to users table
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL,
ADD COLUMN original_email VARCHAR(255) NULL;