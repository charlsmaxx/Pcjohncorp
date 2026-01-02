const express = require('express');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Phone numbers storage file
const PHONE_NUMBERS_FILE = path.join(__dirname, 'phone-numbers.json');

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
    'https://www.pcjohncorp.com',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// Log allowed origins on startup
console.log('\n🌐 CORS Configuration:');
console.log('   Allowed origins:', allowedOrigins);
console.log('');

// CORS middleware with explicit handling
app.use(cors({
    origin: function (origin, callback) {
        console.log('🔍 CORS check - Origin received:', origin || '(no origin)');
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            console.log('✅ CORS: Allowing request with no origin');
            return callback(null, true);
        }
        
        // Normalize origin (remove trailing slash)
        const normalizedOrigin = origin.replace(/\/$/, '');
        
        // Check for exact match or starts with (for subdomains)
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, '');
            return normalizedOrigin === normalizedAllowed || normalizedOrigin.startsWith(normalizedAllowed);
        });
        
        if (isAllowed) {
            console.log('✅ CORS: Allowing origin:', normalizedOrigin);
            callback(null, true);
        } else {
            // Log for debugging
            console.log('❌ CORS: Blocked origin:', normalizedOrigin);
            console.log('   Allowed origins:', allowedOrigins);
            
            // Temporarily allow all in production to get it working
            console.log('⚠️  CORS: Temporarily allowing origin for debugging');
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: Serve static files from frontend (for local development only)
// For production, deploy frontend and backend separately
// Frontend is now deployed separately on Netlify, so we don't serve static files here
// If you need to serve frontend locally, uncomment below:
/*
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    app.get('/', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}
*/

// Health check endpoint for root path
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'PcJohncorp Backend API is running',
        endpoints: {
            health: '/api/health',
            contact: '/api/contact',
            testEmail: '/api/test-email'
        }
    });
});

// Determine email service (used throughout the file)
// Handle whitespace and case sensitivity issues
const emailServiceRaw = process.env.EMAIL_SERVICE || '';
const emailService = emailServiceRaw.trim().toLowerCase();

// Helper function to check if Resend should be used
function isResendService() {
    // Check if EMAIL_SERVICE is explicitly set to 'resend'
    if (emailService === 'resend') {
        return true;
    }
    // Auto-detect: If RESEND_API_KEY is set, assume Resend (even if EMAIL_SERVICE not set)
    // Check for both raw and trimmed versions, handle empty strings
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.trim().length > 0) {
        return true;
    }
    return false;
}

// Debug logging for email service detection (always log in production too for debugging)
console.log('\n📧 Email Service Configuration:');
console.log(`   EMAIL_SERVICE (raw)=${JSON.stringify(process.env.EMAIL_SERVICE)}`);
console.log(`   EMAIL_SERVICE (processed)=${emailService || '(not set)'}`);
console.log(`   RESEND_API_KEY (exists)=${!!process.env.RESEND_API_KEY}`);
console.log(`   RESEND_API_KEY (length)=${process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0}`);
console.log(`   RESEND_API_KEY (last 4)=${process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : 'NOT SET ❌'}`);
console.log(`   EMAIL_USER=${process.env.EMAIL_USER || 'NOT SET ❌'}`);
console.log(`   EMAIL_PASS=${process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET ❌'}`);

const usingResend = isResendService();
console.log(`   isResendService()=${usingResend}`);

if (usingResend) {
    if (!emailService) {
        console.log('   ℹ️  Auto-detected Resend (RESEND_API_KEY found but EMAIL_SERVICE not set)');
    }
    console.log('   ✅ Using Resend email service');
} else {
    console.log('   ℹ️  Using Gmail/Generic SMTP');
    console.log(`   ⚠️  RESEND_API_KEY check: ${process.env.RESEND_API_KEY ? 'EXISTS but not detected' : 'NOT FOUND'}`);
}
console.log('');

// Create transporter configuration based on email service
function createTransporterConfig() {
    
    // Resend SMTP configuration (recommended for Render and cloud platforms)
    if (isResendService()) {
        if (!process.env.RESEND_API_KEY) {
            console.error('\n❌ ERROR: RESEND_API_KEY not found!');
            console.error('When using EMAIL_SERVICE=resend, you must set RESEND_API_KEY');
            console.error('Get your API key from: https://resend.com/api-keys\n');
        }
        
        return {
            host: 'smtp.resend.com',
            port: 465,
            secure: true, // SSL/TLS
            auth: {
                user: 'resend',
                pass: process.env.RESEND_API_KEY
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000
        };
    }
    
    // Default Gmail/Generic SMTP configuration
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    return {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
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
    };
}

// Create reusable transporter object using SMTP transport
const transporterConfig = createTransporterConfig();
const transporter = nodemailer.createTransport(transporterConfig);

// Check if environment variables are set (only for non-Resend services)
const isResend = isResendService();
if (!isResend) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('\n❌ ERROR: Email credentials not found!');
        console.error('Please create a .env file with the following:');
        console.error('EMAIL_USER=your-email@gmail.com');
        console.error('EMAIL_PASS=your-app-password');
        console.error('RECEIVING_EMAIL=info@pcjohncorp.com\n');
        console.error('For Gmail, you MUST use an App Password, not your regular password.');
        console.error('\n💡 Tip: For Render/cloud platforms, consider using Resend:');
        console.error('   Set EMAIL_SERVICE=resend and RESEND_API_KEY=your_key');
        console.error('   See RENDER_EMAIL_FIX.md for details.\n');
        console.error('See EMAIL_SETUP.md for detailed instructions.\n');
    }
} else {
    console.log('✅ Resend service detected - skipping Gmail credential check');
}

// Verify transporter configuration with better error handling
// Skip verify for Resend (it may timeout during verify but still work for sending)
const isResendForVerify = isResendService();
if (isResendForVerify) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim().length === 0) {
        console.error('\n❌ ERROR: RESEND_API_KEY not found or is empty!');
        console.error('When using Resend, you must set RESEND_API_KEY in environment variables.');
        console.error('Get your API key from: https://resend.com/api-keys\n');
    } else {
        console.log('✅ Resend email service configured');
        console.log(`📬 Receiving emails at: ${process.env.RECEIVING_EMAIL || 'configured email'}`);
        console.log(`🔌 Using Resend SMTP: smtp.resend.com:465`);
        
        // Check if domain email is configured
        if (process.env.RESEND_FROM_EMAIL) {
            console.log(`📧 Sending emails from: ${process.env.RESEND_FROM_EMAIL}`);
            console.log('✅ Using verified domain email');
        } else {
            console.log('📧 Sending emails from: onboarding@resend.dev (default)');
            console.log('⚠️  RESEND_FROM_EMAIL not set - using default Resend email');
            console.log('💡 To use your domain (pcjohncorp.com), set RESEND_FROM_EMAIL=noreply@pcjohncorp.com');
            console.log('📖 See RESEND_DOMAIN_VERIFICATION.md for domain verification steps');
        }
        
        console.log('⚠️  Note: Connection verification skipped for Resend (will verify on first send)\n');
    }
} else {
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
                console.error('1. Cloud platform (Render/Heroku/etc.) is blocking SMTP ports (587 or 465)');
                console.error('2. Firewall is blocking SMTP ports');
                console.error('3. DNS resolution issues');
                console.error('4. Network connectivity problems');
                console.error('\n📖 Solutions (for Render/Cloud Platforms):');
                console.error('1. Try port 465 instead of 587: Set SMTP_PORT=465 in environment variables');
                console.error('2. Use Resend API (recommended): Set EMAIL_SERVICE=resend and RESEND_API_KEY');
                console.error('3. Use SendGrid: Set EMAIL_SERVICE=sendgrid and SENDGRID_API_KEY');
                console.error('\n📖 Solutions (for Local Development):');
                console.error('1. Check Windows Firewall - allow Node.js');
                console.error('2. Temporarily disable antivirus to test');
                console.error('3. Try using port 465: Set SMTP_PORT=465 in .env');
                console.error('4. Test DNS: nslookup smtp.gmail.com');
                console.error('5. Test port: Test-NetConnection smtp.gmail.com -Port 587');
                console.error('\nSee RENDER_EMAIL_FIX.md for Render-specific solutions.');
                console.error('See EMAIL_TROUBLESHOOTING.md for detailed instructions.\n');
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
}

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

// Initialize Resend client if using Resend
let resendClient = null;
if (isResendService() && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend client initialized');
}

// Helper function to send email with retry logic
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    // Use Resend API if configured, otherwise use Nodemailer SMTP
    if (isResendService() && resendClient) {
        return await sendEmailWithResendAPI(mailOptions, maxRetries);
    } else {
        return await sendEmailWithNodemailer(mailOptions, maxRetries);
    }
}

// Send email using Resend REST API (no SMTP, works on Render)
async function sendEmailWithResendAPI(mailOptions, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📤 Resend API Attempt ${attempt} of ${maxRetries}...`);
            
            // Extract email from "Name <email>" format
            const fromMatch = mailOptions.from.match(/<(.+)>/);
            const fromEmail = fromMatch ? fromMatch[1] : mailOptions.from;
            
            const { data, error } = await resendClient.emails.send({
                from: fromEmail,
                to: mailOptions.to,
                replyTo: mailOptions.replyTo,
                subject: mailOptions.subject,
                html: mailOptions.html,
                text: mailOptions.text
            });
            
            if (error) {
                throw new Error(error.message || 'Resend API error');
            }
            
            console.log('✅ Resend API email sent successfully!');
            console.log('📧 Resend ID:', data?.id);
            
            // Return in Nodemailer-compatible format
            return {
                messageId: data?.id,
                response: 'Email sent via Resend API',
                accepted: [mailOptions.to]
            };
        } catch (error) {
            lastError = error;
            console.error(`❌ Resend API Attempt ${attempt} failed:`, error.message);
            if (attempt < maxRetries) {
                const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}

// Send email using Nodemailer SMTP (for Gmail/other SMTP)
async function sendEmailWithNodemailer(mailOptions, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`📤 SMTP Attempt ${attempt} of ${maxRetries}...`);
            const info = await transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            lastError = error;
            console.error(`❌ SMTP Attempt ${attempt} failed:`, error.message);
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
        
        // Determine sender email based on email service
        let senderEmail;
        if (isResendService()) {
            // Resend: Use verified domain email or onboarding@resend.dev for free accounts
            senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            
            // Warn if using default onboarding email (domain not configured)
            if (!process.env.RESEND_FROM_EMAIL || senderEmail === 'onboarding@resend.dev') {
                console.log('⚠️  Using default Resend email (onboarding@resend.dev)');
                console.log('💡 Tip: Set RESEND_FROM_EMAIL=noreply@pcjohncorp.com in Render to use your verified domain');
                console.log('📖 See RESEND_DOMAIN_VERIFICATION.md for domain setup instructions');
            } else {
                console.log(`✅ Using verified domain email: ${senderEmail}`);
            }
        } else {
            senderEmail = process.env.EMAIL_USER;
        }
        
        const receivingEmail = process.env.RECEIVING_EMAIL || senderEmail;
        
        console.log('📬 Email config:', {
            service: isResendService() ? 'resend' : (emailService || 'smtp'),
            from: senderEmail,
            to: receivingEmail,
            hasCredentials: isResendService() ? !!process.env.RESEND_API_KEY : !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
            usingDomainEmail: isResendService() && process.env.RESEND_FROM_EMAIL ? true : false
        });

        // Email content
        const mailOptions = {
            from: `"${sanitizedName}" <${senderEmail}>`,
            to: receivingEmail, // Email where you want to receive messages
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
        console.log('📧 Mail options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            usingService: isResendService() ? 'Resend' : 'SMTP'
        });
        
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
        
        // Check configuration based on email service
        if (isResendService()) {
            if (!process.env.RESEND_API_KEY) {
                return res.status(500).json({
                    success: false,
                    message: 'Resend API key not configured',
                    service: 'resend',
                    hasResendKey: !!process.env.RESEND_API_KEY
                });
            }
        } else {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                return res.status(500).json({
                    success: false,
                    message: 'Email credentials not configured',
                    service: 'smtp',
                    hasEmailUser: !!process.env.EMAIL_USER,
                    hasEmailPass: !!process.env.EMAIL_PASS
                });
            }
        }
        
        // Verify transporter (skip for Resend - it may timeout but will work on actual send)
        if (isResendService()) {
            console.log('⚠️  Skipping verification for Resend (will verify on actual send)');
        } else {
            await transporter.verify();
        }
        
        // Determine sender email based on email service
        let testSenderEmail;
        if (isResendService()) {
            testSenderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
            
            // Warn if using default onboarding email
            if (!process.env.RESEND_FROM_EMAIL || testSenderEmail === 'onboarding@resend.dev') {
                console.log('⚠️  Using default Resend email for test');
                console.log('💡 Set RESEND_FROM_EMAIL=noreply@pcjohncorp.com to use your verified domain');
            }
        } else {
            testSenderEmail = process.env.EMAIL_USER;
        }
        
        // Try sending a test email
        const testMailOptions = {
            from: testSenderEmail,
            to: process.env.RECEIVING_EMAIL || testSenderEmail,
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

// Helper function to read phone numbers from file
function readPhoneNumbers() {
    try {
        if (fs.existsSync(PHONE_NUMBERS_FILE)) {
            const data = fs.readFileSync(PHONE_NUMBERS_FILE, 'utf8');
            return JSON.parse(data);
        } else {
            // Initialize with default numbers
            const defaultNumbers = ['+18454041285', '+13479024742', '+2348134831511'];
            writePhoneNumbers(defaultNumbers);
            return defaultNumbers;
        }
    } catch (error) {
        console.error('Error reading phone numbers:', error);
        return ['+18454041285', '+13479024742', '+2348134831511'];
    }
}

// Helper function to write phone numbers to file
function writePhoneNumbers(phoneNumbers) {
    try {
        fs.writeFileSync(PHONE_NUMBERS_FILE, JSON.stringify(phoneNumbers, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing phone numbers:', error);
    }
}

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        
        if (!adminEmail || !adminPassword) {
            return res.status(500).json({
                success: false,
                message: 'Admin credentials not configured'
            });
        }
        
        // Simple authentication (you can improve this with JWT later)
        if (email === adminEmail && password === adminPassword) {
            // In production, use JWT tokens or sessions
            res.status(200).json({
                success: true,
                message: 'Login successful'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

// Get phone numbers endpoint (for admin panel)
app.get('/api/admin/phone-numbers', async (req, res) => {
    try {
        const phoneNumbers = readPhoneNumbers();
        
        res.status(200).json({
            success: true,
            phoneNumbers: phoneNumbers
        });
    } catch (error) {
        console.error('Error getting phone numbers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get phone numbers'
        });
    }
});

// Add phone number endpoint
app.post('/api/admin/phone-numbers', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }
        
        // Validate phone number format
        const cleanedPhone = phoneNumber.trim().replace(/[\s\-\(\)]/g, '');
        if (!cleanedPhone.match(/^\+?\d{10,15}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use format: +1234567890'
            });
        }
        
        // Ensure it starts with +
        const formattedPhone = cleanedPhone.startsWith('+') ? cleanedPhone : `+${cleanedPhone}`;
        
        const phoneNumbers = readPhoneNumbers();
        
        // Check if already exists
        if (phoneNumbers.includes(formattedPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already exists'
            });
        }
        
        // Add new number
        phoneNumbers.push(formattedPhone);
        writePhoneNumbers(phoneNumbers);
        
        console.log('✅ Phone number added:', formattedPhone);
        
        res.status(200).json({
            success: true,
            message: 'Phone number added successfully',
            phoneNumbers: phoneNumbers
        });
    } catch (error) {
        console.error('Error adding phone number:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add phone number'
        });
    }
});

// Delete phone number endpoint
app.delete('/api/admin/phone-numbers', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }
        
        const phoneNumbers = readPhoneNumbers();
        const formattedPhone = phoneNumber.trim();
        
        // Find and remove
        const index = phoneNumbers.indexOf(formattedPhone);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Phone number not found'
            });
        }
        
        phoneNumbers.splice(index, 1);
        writePhoneNumbers(phoneNumbers);
        
        console.log('✅ Phone number deleted:', formattedPhone);
        
        res.status(200).json({
            success: true,
            message: 'Phone number deleted successfully',
            phoneNumbers: phoneNumbers
        });
    } catch (error) {
        console.error('Error deleting phone number:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete phone number'
        });
    }
});

// Bulk call endpoint
app.post('/api/admin/bulk-call', async (req, res) => {
    try {
        const { phoneNumbers } = req.body;
        
        if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Phone numbers array is required'
            });
        }
        
        // Check if Twilio is configured
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
            return res.status(500).json({
                success: false,
                message: 'Twilio is not configured'
            });
        }
        
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const fromPhone = process.env.TWILIO_PHONE_NUMBER;
        const yourPhone = process.env.YOUR_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;
        
        // Use production URL for Twilio (Twilio can't access localhost)
        // In production, always use the Render URL
        let backendUrl = process.env.BACKEND_URL || 'https://pcjohncorp-backend.onrender.com';
        
        // If BACKEND_URL is localhost, use production URL instead
        if (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')) {
            backendUrl = 'https://pcjohncorp-backend.onrender.com';
            console.log('⚠️  BACKEND_URL is localhost, using production URL for Twilio:', backendUrl);
        }
        
        const results = [];
        
        // Make calls to all selected numbers
        for (const phone of phoneNumbers) {
            try {
                const formattedPhone = phone.replace(/[\s\-\(\)]/g, '');
                const toPhone = formattedPhone.startsWith('+') ? formattedPhone : `+1${formattedPhone}`;
                
                const call = await client.calls.create({
                    url: `${backendUrl}/api/twiml?name=Customer`,
                    to: toPhone,
                    from: fromPhone,
                    method: 'GET'
                });
                
                results.push({
                    phone: phone,
                    success: true,
                    callSid: call.sid,
                    status: call.status
                });
                
                // Small delay between calls to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                results.push({
                    phone: phone,
                    success: false,
                    error: error.message,
                    code: error.code
                });
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        
        res.status(200).json({
            success: true,
            message: `Initiated ${successCount} call(s). ${failCount} failed.`,
            results: results,
            summary: {
                total: results.length,
                success: successCount,
                failed: failCount
            }
        });
        
    } catch (error) {
        console.error('Bulk call error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Single Twilio call endpoint (kept for backward compatibility)
app.post('/api/call', async (req, res) => {
    try {
        console.log('📞 Processing call request...');
        const { name, phone } = req.body;
        
        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and phone number are required' 
            });
        }
        
        // Validate phone number format (basic validation)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid phone number format' 
            });
        }
        
        // Check if Twilio is configured
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
            console.error('❌ Twilio credentials not configured');
            return res.status(500).json({ 
                success: false, 
                message: 'Call service is not configured. Please contact us directly at +1 (845) 404-1285.' 
            });
        }
        
        // Initialize Twilio client
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        // Format phone number (remove spaces, dashes, etc.)
        const formattedPhone = phone.replace(/[\s\-\(\)]/g, '');
        const toPhone = formattedPhone.startsWith('+') ? formattedPhone : `+1${formattedPhone}`;
        
        // Your business phone number (where you'll receive the call)
        const fromPhone = process.env.TWILIO_PHONE_NUMBER;
        const yourPhone = process.env.YOUR_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;
        
        console.log('📞 Call details:', {
            from: fromPhone,
            to: toPhone,
            yourPhone: yourPhone
        });
        
        // Use production URL for Twilio (Twilio can't access localhost)
        let backendUrl = process.env.BACKEND_URL || 'https://pcjohncorp-backend.onrender.com';
        if (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')) {
            backendUrl = 'https://pcjohncorp-backend.onrender.com';
            console.log('⚠️  BACKEND_URL is localhost, using production URL for Twilio:', backendUrl);
        }
        
        // Make the call using Twilio
        const call = await client.calls.create({
            url: `${backendUrl}/api/twiml?name=${encodeURIComponent(name)}`,
            to: toPhone,
            from: fromPhone,
            method: 'GET'
        });
        
        console.log('✅ Call initiated successfully!');
        console.log('📞 Call SID:', call.sid);
        console.log('📞 Call Status:', call.status);
        
        res.status(200).json({ 
            success: true, 
            message: 'We are calling you now! Please answer your phone.',
            callSid: call.sid,
            status: call.status
        });
        
    } catch (error) {
        console.error('\n❌ ERROR MAKING CALL:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        let userMessage = 'Failed to initiate call. Please try again later or contact us directly at +1 (845) 404-1285.';
        if (error.code === 21211) {
            userMessage = 'Invalid phone number. Please check the number and try again.';
        } else if (error.code === 21212) {
            userMessage = 'Phone number is not reachable. Please check the number and try again.';
        } else if (error.message) {
            userMessage = `Call error: ${error.message}`;
        }
        
        res.status(500).json({ 
            success: false, 
            message: userMessage,
            error: error.message,
            code: error.code
        });
    }
});

// TwiML endpoint (Twilio webhook for call instructions)
app.get('/api/twiml', (req, res) => {
    const name = req.query.name || 'there';
    const yourPhone = process.env.YOUR_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;
    
    // TwiML response that connects the caller to your business phone
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    
    // Greet the caller
    twiml.say({
        voice: 'alice',
        language: 'en-US'
    }, `Hello ${name}, thank you for contacting PcJohncorp. Please hold while we connect you to our team.`);
    
    // Connect to your business phone
    const dial = twiml.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER
    });
    dial.number(yourPhone);
    
    // If call fails, play a message
    twiml.say({
        voice: 'alice',
        language: 'en-US'
    }, 'We are unable to connect you at this time. Please call us directly at +1 (845) 404-1285 or send us an email. Thank you.');
    
    res.type('text/xml');
    res.send(twiml.toString());
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Contact form endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`Call endpoint: http://localhost:${PORT}/api/call`);
});
