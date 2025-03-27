import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  requireTLS: process.env.SMTP_PORT === '587',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    minVersion: 'TLSv1.2', 
    ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
    rejectUnauthorized: true 
  },
  socketTimeout: 10000
});

export default {
  sendEmail: async ({ to, subject, html }) => {
    try {
      await transporter.sendMail({
        from: `"Sistema de Diagnóstico" <${process.env.SMTP_USER}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html
      });
      console.log('✅ Correo enviado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error crítico SMTP:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw new Error('Error en la configuración del servidor de correo');
    }
  }
};