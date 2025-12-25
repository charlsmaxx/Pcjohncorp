require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('\n');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Add connection timeout
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
});

console.log('Attempting to verify SMTP connection...\n');

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Email server connection error:', error.message);
        console.error('Error code:', error.code);
        
        if (error.code === 'EAUTH') {
            console.error('\n⚠️  AUTHENTICATION FAILED!');
            console.error('Please verify:');
            console.error('1. Your Gmail App Password is correct');
            console.error('2. 2-Step Verification is enabled on your Gmail account');
            console.error('3. You\'re using an App Password, not your regular password');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
            console.error('\n⚠️  CONNECTION TIMEOUT!');
            console.error('Possible causes:');
            console.error('1. Internet connection issue');
            console.error('2. Firewall blocking port 587');
            console.error('3. DNS resolution problem');
            console.error('4. VPN or proxy interfering');
            console.error('\nTrying to resolve smtp.gmail.com...');
            
            // Try to resolve DNS
            const dns = require('dns');
            dns.resolve4('smtp.gmail.com', (err, addresses) => {
                if (err) {
                    console.error('DNS resolution failed:', err.message);
                } else {
                    console.log('smtp.gmail.com resolves to:', addresses);
                }
            });
        }
        process.exit(1);
    } else {
        console.log('✅ Email server connection successful!');
        console.log('📧 Ready to send emails from:', process.env.EMAIL_USER);
        process.exit(0);
    }
});











