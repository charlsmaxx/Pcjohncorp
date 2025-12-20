const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allow requests from frontend
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://charlsmaxx.github.io',
    'https://stately-rabanadas-726bf5.netlify.app',
    'https://pcjohncorp.com',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            // In production, you might want to be stricter
            if (process.env.NODE_ENV === 'production') {
                callback(new Error('Not allowed by CORS'));
            } else {
                callback(null, true); // Allow in development
            }
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: Serve static files from frontend (for local development only)
// For production, deploy frontend and backend separately
// Enable below for local development:
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app password
    },
    // Increased timeouts to handle slow connections
    connectionTimeout: 30000, // 30 seconds (increased from 10)
    greetingTimeout: 30000,   // 30 seconds (increased from 10)
    socketTimeout: 30000,     // 30 seconds (increased from 10)
    // TLS/SSL options for better connection handling
    tls: {
        // Do not fail on invalid certificates (useful for testing)
        rejectUnauthorized: false,
        // Allow legacy TLS versions if needed
        minVersion: 'TLSv1'
    },
    // Connection pool options
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Enable debugging (set to false in production)
    debug: process.env.NODE_ENV !== 'production', // Only debug in development
    logger: process.env.NODE_ENV !== 'production' // Only log in development
});

// Check if environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('\n❌ ERROR: Email credentials not found!');
    console.error('Please create a .env file with the following:');
    console.error('EMAIL_USER=your-email@gmail.com');
    console.error('EMAIL_PASS=your-app-password');
    console.error('RECEIVING_EMAIL=info@pcjohncorp.com\n');
    console.error('For Gmail, you MUST use an App Password, not your regular password.');
    console.error('See EMAIL_SETUP.md for detailed instructions.\n');
}

// Verify transporter configuration with better error handling
transporter.verify(function (error, success) {
    if (error) {
        console.error('\n❌ Email server connection error:', error.message);
        console.error('Error code:', error.code);
        
        if (error.code === 'EAUTH') {
            console.error('\n⚠️  AUTHENTICATION FAILED!');
            console.error('Common causes:');
            console.error('1. Using regular Gmail password instead of App Password');
            console.error('2. 2-Step Verification not enabled');
            console.error('3. Incorrect email or password in .env file');
            console.error('\n📖 Solution:');
            console.error('1. Go to: https://myaccount.google.com/apppasswords');
            console.error('2. Create an App Password for "Mail"');
            console.error('3. Copy the 16-character password');
            console.error('4. Update EMAIL_PASS in your .env file');
            console.error('\nSee EMAIL_SETUP.md for detailed instructions.\n');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION' || error.code === 'ESOCKET') {
            console.error('\n⚠️  CONNECTION TIMEOUT!');
            console.error('This usually means:');
            console.error('1. Firewall is blocking SMTP ports (587 or 465)');
            console.error('2. DNS resolution issues');
            console.error('3. Network connectivity problems');
            console.error('4. Antivirus blocking the connection');
            console.error('\n📖 Solutions:');
            console.error('1. Check Windows Firewall - allow Node.js');
            console.error('2. Temporarily disable antivirus to test');
            console.error('3. Try using port 465 instead of 587 (set SMTP_PORT=465 in .env)');
            console.error('4. Test DNS: nslookup smtp.gmail.com');
            console.error('5. Test port: Test-NetConnection smtp.gmail.com -Port 587');
            console.error('6. Try a different network (mobile hotspot)');
            console.error('\nSee EMAIL_TROUBLESHOOTING.md for detailed instructions.\n');
        } else {
            console.error('\n⚠️  CONNECTION ERROR!');
            console.error('Error details:', {
                code: error.code,
                command: error.command,
                response: error.response
            });
            console.error('\nSee EMAIL_TROUBLESHOOTING.md for detailed instructions.\n');
        }
    } else {
        console.log('✅ Email server is ready to send messages');
        console.log(`📧 Sending emails from: ${process.env.EMAIL_USER}`);
        console.log(`📬 Receiving emails at: ${process.env.RECEIVING_EMAIL || process.env.EMAIL_USER}`);
        console.log(`🔌 Using SMTP: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${process.env.SMTP_PORT || '587'}\n`);
    }
});

// Request logging middleware for debugging
app.use((req, res, next) => {
    if (req.path === '/api/contact') {
        console.log('\n📥 Incoming request:', {
            method: req.method,
            path: req.path,
            body: req.body
        });
    }
    next();
});

// Helper function to create transporter with retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📤 Attempt ${attempt} of ${maxRetries}...`);
            const info = await transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            lastError = error;
            console.error(`❌ Attempt ${attempt} failed:`, error.message);
            if (attempt < maxRetries) {
                const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        console.log('📧 Processing contact form submission...');
        const { name, email, phone, message } = req.body;
        
        console.log('📋 Form data received:', { name, email, phone, messageLength: message?.length });

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email address' 
            });
        }

        // Sanitize inputs to prevent XSS and HTML injection
        const sanitize = (str) => {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
        };

        const sanitizedName = sanitize(name);
        const sanitizedEmail = sanitize(email);
        const sanitizedPhone = sanitize(phone);
        const sanitizedMessage = sanitize(message);

        console.log('✅ Data sanitized, preparing email...');
        console.log('📬 Email config:', {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVING_EMAIL || process.env.EMAIL_USER,
            hasCredentials: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
        });

        // Email content
        const mailOptions = {
            from: `"${sanitizedName}" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVING_EMAIL || process.env.EMAIL_USER, // Email where you want to receive messages
            replyTo: sanitizedEmail, // So you can reply directly to the sender
            subject: `New Contact Form Message from ${sanitizedName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${sanitizedName}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
                        <p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${sanitizedPhone}">${sanitizedPhone}</a></p>
                        <div style="margin-top: 20px;">
                            <strong>Message:</strong>
                            <p style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px; white-space: pre-wrap;">${sanitizedMessage}</p>
                        </div>
                    </div>
                    <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
                        This message was sent from the PcJohncorp contact form.
                    </p>
                </div>
            `,
            text: `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Phone: ${sanitizedPhone}

Message:
${sanitizedMessage}

---
This message was sent from the PcJohncorp contact form.
            `
        };

        // Send email with retry logic
        console.log('📤 Attempting to send email...');
        const info = await sendEmailWithRetry(mailOptions, 3);
        
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📬 Response:', info.response);

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been sent successfully! We will get back to you soon.' 
        });

    } catch (error) {
        console.error('\n❌ ERROR SENDING EMAIL:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error command:', error.command);
        console.error('Error response:', error.response);
        console.error('Error responseCode:', error.responseCode);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        // Determine user-friendly error message
        let userMessage = 'Failed to send message. Please try again later or contact us directly.';
        if (error.code === 'EAUTH') {
            userMessage = 'Email authentication failed. Please check server configuration.';
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            userMessage = 'Could not connect to email server. Please check your internet connection.';
        } else if (error.message) {
            userMessage = `Email error: ${error.message}`;
        }
        
        res.status(500).json({ 
            success: false, 
            message: userMessage,
            error: error.message,
            code: error.code
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Test email endpoint (for debugging)
app.post('/api/test-email', async (req, res) => {
    try {
        console.log('\n🧪 Testing email configuration...');
        
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({
                success: false,
                message: 'Email credentials not configured',
                hasEmailUser: !!process.env.EMAIL_USER,
                hasEmailPass: !!process.env.EMAIL_PASS
            });
        }
        
        // Verify transporter
        await transporter.verify();
        
        // Try sending a test email
        const testMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVING_EMAIL || process.env.EMAIL_USER,
            subject: 'Test Email from PcJohncorp Server',
            text: 'This is a test email to verify the email configuration is working correctly.',
            html: '<p>This is a test email to verify the email configuration is working correctly.</p>'
        };
        
        const info = await transporter.sendMail(testMailOptions);
        
        res.json({
            success: true,
            message: 'Test email sent successfully!',
            messageId: info.messageId,
            response: info.response
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            code: error.code,
            response: error.response
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Contact form endpoint: http://localhost:${PORT}/api/contact`);
});
