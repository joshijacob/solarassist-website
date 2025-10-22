export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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

    // Validate phone format (Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit Indian phone number.' 
      });
    }

    // Send email using Resend (Vercel's recommended service)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Solar Assist <contact@solarassist.in>',
        to: ['solarassist25@gmail.com'],
        subject: `New Contact Form: ${service} - Solar Assist`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
                  .header { background: #1a6d34; color: white; padding: 20px; text-align: center; }
                  .content { padding: 20px; background: #f9f9f9; }
                  .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; }
                  .label { font-weight: bold; color: #1a6d34; display: inline-block; width: 150px; }
                  .footer { background: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>Solar Assist</h1>
                  <p>New Contact Form Submission</p>
              </div>
              
              <div class="content">
                  <h2 style="color: #1a6d34; margin-top: 0;">Contact Request Details</h2>
                  
                  <div class="field">
                      <span class="label">Customer Name:</span> ${name}
                  </div>
                  
                  <div class="field">
                      <span class="label">Phone Number:</span> ${phone}
                  </div>
                  
                  <div class="field">
                      <span class="label">Email:</span> ${email}
                  </div>
                  
                  <div class="field">
                      <span class="label">Service Required:</span> ${service}
                  </div>
                  
                  <div class="field">
                      <span class="label">System Type:</span> ${systemType || 'Not specified'}
                  </div>
                  
                  <div class="field">
                      <span class="label">Message:</span><br>
                      <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-left: 4px solid #1a6d34;">
                          ${message.replace(/\n/g, '<br>')}
                      </div>
                  </div>
              </div>
              
              <div class="footer">
                  <p>This email was sent from the Solar Assist website contact form.</p>
                  <p>Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                  <p>You can reply directly to this email to contact ${name}.</p>
              </div>
          </body>
          </html>
        `,
      }),
    });

    if (emailResponse.ok) {
      console.log('Email sent successfully via Resend');
      res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully! We will get back to you soon.' 
      });
    } else {
      const errorData = await emailResponse.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email via Resend');
    }

  } catch (error) {
    console.error('Error in send-email API:', error);
    
    // Fallback: Log the form data (you can check Vercel logs)
    console.log('Form data that would have been emailed:', {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      service: req.body.service,
      systemType: req.body['system-type'],
      message: req.body.message
    });

    res.status(500).json({ 
      success: false, 
      message: 'There was a problem sending your message. Please try again or call us directly at 8281770660.' 
    });
  }
}
