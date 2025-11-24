const nodemailer = require('nodemailer');
require('dotenv').config({ quiet: true });

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordReset(email, token) {
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Reset Password Request',
      html: `
  <div style="padding:40px 0; font-family:Arial, sans-serif;">

  <h1 style=" 
    font-size:29px;
    font-weight:600;
    color:#1a1a1a;
    text-align: center;
  ">${process.env.NAME_APP}</h1>

    <!-- Card -->
    <div style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        padding:40px 28px;
        border-radius:12px;
      ">

      <!-- Header Title -->
      <h2 style="
          font-size:24px;
          font-weight:600;
          color:#1a1a1a;
          margin:0 0 20px;
          text-align: center;
        ">
        Password Reset Request
      </h2>

      <!-- Greeting -->
      <p style="
          font-size:14px;
          color:#4a4a4a;
          margin:0 0 20px;
          line-height:1.6;
        ">
        Hai ...
      </p>

      <!-- Body Text -->
      <p style="
          font-size:14px;
          color:#4a4a4a;
          margin:0 0 28px;
          line-height:1.6;
        ">
        You requested to reset your password. Click the link below to proceed:
      </p>

      <!-- Button -->
      <div style="text-align:center; margin:30px 0;">
        <a href="${resetLink}"
          style="
            display:inline-block;
            padding:14px 42px;
            background:#006be8;
            color:#ffffff;
            font-size:16px;
            text-decoration:none;
            border-radius:28px;
            font-weight:600;
          ">
          Reset Password
        </a>
      </div>

      <!-- Info -->
      <p style="
          font-size:14px;
          color:#4a4a4a;
          margin:0 0 24px;
          line-height:1.6;
        ">
        This link will expire in 1 hour.  
        If you didn't request this reset, please ignore this email.
      </p>

      <!-- Footer Text -->
      <p style="
          font-size:14px;
          color:#4a4a4a;
          margin:32px 0 0;
        ">
        IT Support Team
      </p>

      <!-- Thin Line -->
      <hr style="
          border:none;
          border-top:1px solid #e4e4e4;
          margin:32px 0;
        " />

      <!-- Fallback -->
      <p style="font-size:12px; color:#6d6d6d; line-height:1.6;">
        If the button doesn't work, copy and paste this link in your browser:
      </p>

      <p style="
          font-size:12px;
          color:#006be8;
          word-break:break-all;
          margin:8px 0 0;
        ">
        ${resetLink}
      </p>

    </div>

    <!-- Bottom Copyright -->
    <div style="text-align:center; margin-top:20px; color:#8c8c8c; font-size:11px;">
      © ${new Date().getFullYear()} Your Company. All Rights Reserved.
    </div>

  </div>
`
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();