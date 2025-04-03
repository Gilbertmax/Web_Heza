-- Insertar usuario administrador
INSERT INTO users (id, nombre, email, password, telefono, rol, activo, fecha_registro) VALUES
(1, 'Administrador', 'AdminHeza', '$2b$10$RTvPvVwqVZEIJxtI.NL00OU/pX//YAfQZEX12GiD5G7cLHLOs9136', '5551234567', 'admin', 1, '2025-04-03 19:22:17');

-- Insertar categorías de documentos
INSERT INTO categorias_documentos (id, nombre, descripcion) VALUES
(1, 'Facturación', 'Documentos relacionados con facturas y comprobantes fiscales'),
(2, 'Contratos', 'Contratos y acuerdos legales'),
(3, 'Estados Financieros', 'Balances, estados de resultados y otros reportes financieros'),
(4, 'Declaraciones', 'Declaraciones fiscales y tributarias'),
(5, 'Nómina', 'Documentos relacionados con nómina y personal'),
(6, 'Auditoría', 'Documentos de auditoría interna y externa'),
(7, 'Legal', 'Documentos legales y jurídicos');

-- Insertar servicios
INSERT INTO servicios (id, nombre, descripcion, activo) VALUES
(1, 'Diagnóstico Empresarial', 'Evaluación integral de la situación fiscal y financiera de la empresa', 1),
(2, 'Asesoría Fiscal', 'Consultoría especializada en materia fiscal y tributaria', 1),
(3, 'Contabilidad', 'Servicios de contabilidad general y especializada', 1),
(4, 'Asesoría Laboral y Seguro Social', 'Consultoría en temas laborales y de seguridad social', 1),
(5, 'Finanzas Corporativas', 'Gestión financiera para empresas', 1),
(6, 'Legal Corporativo', 'Servicios legales para empresas', 1),
(7, 'Consultoría y Consejos Consultivos', 'Asesoría estratégica para negocios', 1),
(8, 'Protección Patrimonial', 'Servicios de protección de activos y patrimonio', 1);

-- Insertar clientes de ejemplo
INSERT INTO clients (nombre, razon_social, rfc, direccion, telefono, email, contacto_principal, activo) VALUES
('Empresa Demo', 'Empresa Demo S.A. de C.V.', 'DEMO010101ABC', 'Av. Ejemplo 123, Col. Centro, Ciudad de México', '5551234567', 'contacto@empresademo.com', 'Juan Pérez', 1),
('Corporativo Ejemplo', 'Corporativo Ejemplo S.A.', 'CORP020202DEF', 'Blvd. Muestra 456, Col. Industrial, Guadalajara', '3339876543', 'info@corporativoejemplo.com', 'María Rodríguez', 1);

-- Asignar servicios a clientes
INSERT INTO client_services (client_id, service_id, fecha_inicio, fecha_fin, notas) VALUES
(1, 1, '2023-01-01', '2023-12-31', 'Servicio anual de diagnóstico'),
(1, 3, '2023-01-01', '2023-12-31', 'Contabilidad mensual'),
(2, 2, '2023-03-15', '2023-09-15', 'Asesoría fiscal semestral'),
(2, 5, '2023-02-01', '2023-12-31', 'Gestión financiera anual');

-- Insertar eventos de ejemplo
INSERT INTO events (titulo, descripcion, fecha_inicio, fecha_fin, ubicacion, tipo, creado_por) VALUES
('Seminario Fiscal 2023', 'Actualización sobre reformas fiscales', '2023-06-15 09:00:00', '2023-06-15 13:00:00', 'Hotel Fiesta Americana, Guadalajara', 'Seminario', 1),
('Taller de Finanzas Personales', 'Aprende a gestionar tus finanzas personales', '2023-07-20 16:00:00', '2023-07-20 19:00:00', 'Oficinas HEZA, CDMX', 'Taller', 1);