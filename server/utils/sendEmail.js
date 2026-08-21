const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    let transporter;

    if (process.env.EMAIL_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } else {
      // Use Ethereal test account for development
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@store.com",
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to,info);
    // Preview URL only available with Ethereal test accounts
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 Preview email at:", previewUrl);
    }
  } catch (error) {
    console.error("❌ Error sending email to:", to, error.message);
  }
};

module.exports = sendEmail;
