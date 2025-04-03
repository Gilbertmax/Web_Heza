import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  console.log('Iniciando carga de datos de prueba...');
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO users (nombre, email, password, telefono, rol)
      VALUES (?, ?, ?, ?, ?)
    `, ['Administrador', 'admin@heza.com.mx', adminPassword, '5551234567', 'admin']);
    
    // Crear algunos clientes de ejemplo
    const clientPassword = await bcrypt.hash('cliente123', 10);
    
    // Cliente 1
    const [clientResult1] = await connection.query(`
      INSERT INTO users (nombre, email, password, telefono, rol)
      VALUES (?, ?, ?, ?, ?)
    `, ['Empresa ABC', 'contacto@abc.com', clientPassword, '5552345678', 'cliente']);
    
    await connection.query(`
      INSERT INTO clientes (id, empresa, rfc, direccion, ciudad, estado, codigo_postal, giro, numero_empleados, ventas_anuales)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      clientResult1.insertId,
      'Empresa ABC S.A. de C.V.',
      'ABC123456XYZ',
      'Av. Reforma 123',
      'Ciudad de México',
      'CDMX',
      '01234',
      'Tecnología',
      25,
      5000000
    ]);
    
    // Cliente 2
    const [clientResult2] = await connection.query(`
      INSERT INTO users (nombre, email, password, telefono, rol)
      VALUES (?, ?, ?, ?, ?)
    `, ['Comercial XYZ', 'info@xyz.com', clientPassword, '5553456789', 'cliente']);
    
    await connection.query(`
      INSERT INTO clientes (id, empresa, rfc, direccion, ciudad, estado, codigo_postal, giro, numero_empleados, ventas_anuales)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      clientResult2.insertId,
      'Comercial XYZ S.A. de C.V.',
      'XYZ789012ABC',
      'Calle Insurgentes 456',
      'Guadalajara',
      'Jalisco',
      '45678',
      'Comercio',
      12,
      2500000
    ]);
    
    // Crear categorías de documentos
    await connection.query(`
      INSERT INTO categorias_documentos (nombre, descripcion)
      VALUES 
      ('Facturación', 'Documentos relacionados con facturas y comprobantes fiscales'),
      ('Contratos', 'Contratos y acuerdos legales'),
      ('Estados Financieros', 'Balances, estados de resultados y otros reportes financieros'),
      ('Nóminas', 'Documentos relacionados con pagos de nómina'),
      ('Impuestos', 'Declaraciones y documentos fiscales'),
      ('Legal', 'Documentos legales y corporativos'),
      ('Administrativo', 'Documentos administrativos generales')
    `);
    
    // Crear servicios
    await connection.query(`
      INSERT INTO servicios (nombre, descripcion)
      VALUES 
      ('Diagnóstico Empresarial', 'Evaluación integral de la situación fiscal y financiera de la empresa'),
      ('Asesoría Fiscal', 'Consultoría especializada en materia fiscal y tributaria'),
      ('Contabilidad', 'Servicios de contabilidad general y especializada'),
      ('Asesoría Laboral y Seguro Social', 'Consultoría en temas laborales y de seguridad social'),
      ('Finanzas Corporativas', 'Servicios de gestión financiera para empresas'),
      ('Legal Corporativo', 'Asesoría legal para empresas'),
      ('Consultoría y Consejos Consultivos', 'Servicios de consultoría estratégica'),
      ('Protección Patrimonial', 'Servicios para proteger el patrimonio empresarial y personal')
    `);
    
    // Asignar servicios a clientes
    await connection.query(`
      INSERT INTO cliente_servicio (id_cliente, id_servicio, fecha_inicio, fecha_fin, notas)
      VALUES 
      (?, 1, '2023-01-01', NULL, 'Servicio activo'),
      (?, 3, '2023-01-01', NULL, 'Servicio activo'),
      (?, 5, '2023-01-01', NULL, 'Servicio activo'),
      (?, 2, '2023-01-01', NULL, 'Servicio activo'),
      (?, 4, '2023-01-01', NULL, 'Servicio activo')
    `, [clientResult1.insertId, clientResult1.insertId, clientResult1.insertId, clientResult2.insertId, clientResult2.insertId]);
    
    // Crear eventos
    await connection.query(`
      INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, tipo, imagen)
      VALUES 
      ('Seminario Fiscal 2024', 'Actualización sobre las nuevas disposiciones fiscales', '2024-06-15', '10:00:00', 'Hotel Fiesta Americana, CDMX', 'Próximo', 'evento1.jpg'),
      ('Taller de Finanzas Corporativas', 'Estrategias para optimizar las finanzas de tu empresa', '2024-07-20', '09:00:00', 'Oficinas Heza, Guadalajara', 'Próximo', 'evento2.jpg'),
      ('Conferencia Reforma Laboral', 'Implicaciones de la nueva reforma laboral', '2023-11-10', '11:00:00', 'Centro de Convenciones, Monterrey', 'Pasado', 'evento3.jpg')
    `);
    
    await connection.commit();
    console.log('Datos de prueba cargados correctamente');
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al cargar datos de prueba:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Ejecutar la función si este archivo se ejecuta directamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export default seedDatabase;