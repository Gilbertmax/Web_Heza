import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = async () => {
  try {
    console.log('Creating email transporter with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      user: 'set (hidden)',
      pass: 'set (hidden)'
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: false,
      logger: false
    });
  
    return transporter;
  } catch (error) {
    console.error('❌ Error sending email:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      command: error.command
    });
    throw new Error(`Error sending email: ${error.message}`);
  }
};

const emailService = {
  sendEmail: async ({ to, subject, html }) => {
    try {
      console.log(`Attempting to send email to: ${to}`);
      const transporter = await createTransporter();
      
      try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (verifyError) {
        console.error('SMTP Verification Error:', verifyError);
        throw new Error(`SMTP verification failed: ${verifyError.message}`);
      }
      
      const info = await transporter.sendMail({
        from: `"Sistema HEZA" <${process.env.SMTP_USER || 'gilberto_gonzalez@heza.com.mx'}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html
      });
      
      console.log('✅ Email sent successfully:', info.messageId);
      
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        command: error.command
      });
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
};

export default emailService;