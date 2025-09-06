import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function verifyTransport() {
  try {
    await transporter.verify();
    console.log('SMTP ready');
  } catch (e) {
    console.warn('SMTP verify failed (dev ok):', e.message);
  }
}
