const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: 'Welcome Server!' });
    } catch (error) {
        console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});
// POST endpoint for contact form
app.post('/contact', async (req, res) => {
  const { email, subject, message , name } = req.body;
    console.log('email' , email);
  try {
    // Nodemailer transporter using Gmail
   const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465, // Use 465 for SSL, or 587 for TLS
                secure: true, // true for port 465, false for 587
                auth: {
                    user: process.env.EMAIL_USER, // your Gmail address
                    pass: process.env.EMAIL_PASS  // your 16-character app password
                }
                });

    // Email details
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Portfolio Contact - ${name} <${email}>: ${subject}`,
        html: `
            <h3>New message from your portfolio contact form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
        };


    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
