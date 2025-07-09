const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { sendOTPEmail } = require('../utils/mailer');


// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = generateOTP();
  await sendOTPEmail(email, otp);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
    } else {
      user = new User({ email, otp, otpExpiresAt });
    }

    await user.save();

    // In production, you would send the OTP via email here
    console.log(`📩 OTP for ${email} is: ${otp}`);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();

    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < now) {
      return res.status(401).json({ error: 'OTP expired' });
    }

    // OTP is valid — create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // (Optional) Clear OTP
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      message: 'OTP verified, login successful',
      token,
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
