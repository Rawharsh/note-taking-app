const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: `"Note App OTP" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>This code will expire in 5 minutes.</p>`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };
