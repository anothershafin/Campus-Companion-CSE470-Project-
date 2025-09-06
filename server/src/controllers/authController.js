import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendEmail } from '../utils/sendEmail.js';

function sign(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const user = await User.create({ name, email, password });
  const otp = generateOTP();
  console.log('[DEV] OTP for', email, 'is', otp);

  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  try {
    await sendEmail({
      to: email,
      subject: 'Verify your email (Campus Companion)',
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });
  } catch (e) {
    console.error('[DEV] Failed to send OTP email:', e?.message || e);
  }
  res.json({ message: 'Registered. OTP sent to email.' });
};

export const verify = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'No such user' });
  if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ error: 'OTP expired. Please resend.' });
  }
  if (String(otp) !== String(user.otpCode)) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: 'Email verified. You can now login.' });
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'No such user' });
  const otp = generateOTP();
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  try {
    await sendEmail({
      to: email,
      subject: 'Your new OTP (Campus Companion)',
      html: `<p>Your new OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });
  }  catch (e) {
  console.error('[DEV] Failed to send resend-OTP email:', e?.message || e);
}
  res.json({ message: 'OTP resent.' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' });
  const token = sign(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const updateMe = async (req, res) => {
  const { name, university, phone } = req.body;
  if (typeof name !== 'undefined') req.user.name = name;
  if (typeof university !== 'undefined') req.user.university = university;
  if (typeof phone !== 'undefined') req.user.phone = phone;
  if (req.file) {
    req.user.avatarUrl = `/uploads/${req.file.filename}`;
  }
  await req.user.save();
  res.json({ user: req.user });
};

