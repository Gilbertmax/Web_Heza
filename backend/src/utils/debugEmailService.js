import emailService from './emailService.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const debugEmailService = async () => {
  try {
    console.log('=== Email Service Debug ===');
    
    console.log('\n1. Checking environment variables:');
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    let missingVars = [];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
        console.log(`❌ ${varName} is missing`);
      } else {
        console.log(`✅ ${varName} is set`);
      }
    });
    
    if (missingVars.length > 0) {
      console.log(`\n⚠️ Missing environment variables: ${missingVars.join(', ')}`);
      console.log('Please check your .env file and make sure these variables are set.');
      
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        console.log('✅ .env file exists');
      } else {
        console.log('❌ .env file does not exist');
      }
    } else {
      console.log('\n✅ All required environment variables are set');
    }
    
    console.log('\n2. Testing email sending:');
    const testEmail = process.env.TEST_EMAIL || 'gilberto_gonzalez@heza.com.mx';
    console.log(`Sending test email to: ${testEmail}`);
    
    try {
      await emailService.sendEmail({
        to: testEmail,
        subject: 'Debug Test Email from HEZA System',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Debug Test Email</h2>
            <p>This is a debug test email from the HEZA system.</p>
            <p>If you received this email, the email service is working correctly.</p>
            <p>Time sent: ${new Date().toLocaleString()}</p>
          </div>
        `
      });
      
      console.log('✅ Test email sent successfully');
    } catch (error) {
      console.error('❌ Test email failed:', error);
    }
    
    console.log('\n=== Debug Complete ===');
  } catch (error) {
    console.error('Debug process failed:', error);
  }
};

debugEmailService();