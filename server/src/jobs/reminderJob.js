import cron from 'node-cron';
import Deadline from '../models/Deadline.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

export function startReminderJob() {
  // Run every day at 09:00 Asia/Dhaka. Requires TZ env var.
  cron.schedule('0 9 * * *', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1);

    const due = await Deadline.find({ dueDate: { $gte: start, $lt: end } });
    const byUser = due.reduce((acc, d) => {
      const k = String(d.user);
      acc[k] = acc[k] || [];
      acc[k].push(d);
      return acc;
    }, {});

    for (const [userId, list] of Object.entries(byUser)) {
      const user = await User.findById(userId);
      if (!user || !user.email) continue;
      const items = list.map(d => `• ${d.title}${d.course ? ' (' + d.course + ')' : ''} – due ${d.dueDate.toDateString()}`).join('<br/>');
      try {
        await sendEmail({
          to: user.email,
          subject: 'Reminder: deadlines due tomorrow',
          html: `<p>Hi ${user.name},</p><p>You have the following deadlines due tomorrow:</p><p>${items}</p>`
        });
      } catch {}
    }
  }, { timezone: process.env.TZ || 'Asia/Dhaka' });
}
