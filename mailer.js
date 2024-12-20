  import nodemailer from 'nodemailer';
  import dotenv from 'dotenv';

  dotenv.config();

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // false for port 587
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    },
    // Optionally enable TLS if required
    tls: {
      rejectUnauthorized: false // Only use in development; for production, use proper certificates
    }
  });

  export const sendMail = (to, subject, text, html) => {
    const mailOptions = {
      from: process.env.EMAIL_USER, // This should be a valid email address
      to,
      subject,
      text,
      html
    };

    return transporter.sendMail(mailOptions)
      .then(info => console.log('Email sent:', info.response))
      .catch(error => console.log('Error:', error));
  };
