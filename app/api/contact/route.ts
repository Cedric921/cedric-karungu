import sgMail from '@sendgrid/mail';
import { connectDB, isDbConfigured } from '@/lib/db';
import { Message } from '@/lib/models/Message';
import { ok, fail, readJson, handleError } from '@/lib/api';

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  locale?: string;
};

const EMAIL_TO = process.env.EMAIL_TO || 'ckarungu921@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || EMAIL_TO;

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
  try {
    const body = await readJson<ContactPayload>(req);
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const subject = body.subject?.trim();
    const message = body.message?.trim();
    const locale = body.locale?.trim() || 'en';

    if (!name || !email || !subject || !message) {
      return fail('Missing fields', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return fail('Invalid email', 400);

    const userAgent = req.headers.get('user-agent') || '';
    const fwd = req.headers.get('x-forwarded-for') || '';
    const ip = fwd.split(',')[0].trim();

    let saved = false;
    let messageId: string | null = null;
    if (isDbConfigured()) {
      try {
        await connectDB();
        const doc = await Message.create({
          name,
          email,
          subject,
          message,
          locale,
          userAgent,
          ip,
        });
        messageId = String(doc._id);
        saved = true;
      } catch (dbErr) {
        console.error('[contact] DB persistence failed:', dbErr);
      }
    }

    let emailSent = false;
    let emailError = '';
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to: EMAIL_TO,
          from: FROM_EMAIL,
          subject: `[Portfolio Contact] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
          replyTo: email,
        } as Parameters<typeof sgMail.send>[0]);
        emailSent = true;
      } catch (mailErr) {
        const m = (mailErr as { message?: string })?.message || 'email send failed';
        emailError = m;
        console.error('[contact] SendGrid error:', m);
      }
    }

    if (saved && messageId) {
      try {
        await Message.updateOne({ _id: messageId }, { $set: { emailSent, emailError } });
      } catch {
        // ignore
      }
    }

    if (!saved && !emailSent) {
      return fail('Could not save or send your message. Please try again later.', 500);
    }
    return ok({ saved, emailSent });
  } catch (err) {
    return handleError(err);
  }
}
