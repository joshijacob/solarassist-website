const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, phone, email, service, 'system-type': systemType, message } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address.' 
      });
    }

    // Create email transporter using environment variables
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'solarassist25@gmail.com',
      subject: `New Contact Form: ${service} - Solar Assist`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a6d34; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Solar Assist</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #1a6d34; margin-top: 0;">Contact Details</h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #1a6d34;">Name:</strong> ${name}
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #1a6d34;">Phone:</strong> ${phone}
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #1a6d34;">Email:</strong> ${email}
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #1a6d34;">Service Required:</strong> ${service}
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #1a6d34;">System Type:</strong> ${systemType || 'Not specified'}
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #1a6d34;">Message:</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 5px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
            <p>This email was sent from the Solar Assist website contact form.</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'There was a problem sending your message. Please try again or call us directly.' 
    });
  }
}
