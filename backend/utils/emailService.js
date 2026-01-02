const nodemailer = require('nodemailer');

// Create transporter using Gmail
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send welcome email to new faculty
const sendFacultyWelcomeEmail = async (email, fullName, empId, password) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to WEBSAGA ERP - Your Account Details',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Welcome to WEBSAGA ERP System</h2>
                    <p>Dear ${fullName},</p>
                    <p>Your faculty account has been created successfully. Below are your login credentials:</p>
                    
                    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 10px 0;"><strong>Employee ID:</strong> ${empId}</p>
                        <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background-color: #E5E7EB; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
                    </div>
                    
                    <p><strong>Login URL:</strong> <a href="http://localhost:5173" style="color: #4F46E5;">http://localhost:5173</a></p>
                    
                    <div style="background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                        <p style="margin: 0; color: #92400E;"><strong>⚠️ Important Security Notice:</strong></p>
                        <p style="margin: 10px 0 0 0; color: #92400E;">Please change your password after your first login for security purposes.</p>
                    </div>
                    
                    <p>If you have any questions or need assistance, please contact the administrator.</p>
                    
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #6B7280; font-size: 12px;">
                        This is an automated email from WEBSAGA ERP System - GMR Institute of Technology.<br>
                        Please do not reply to this email.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendFacultyWelcomeEmail
};
