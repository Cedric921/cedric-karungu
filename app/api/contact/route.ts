import sgMail from '@sendgrid/mail';

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMAIL_TO = process.env.EMAIL_TO || 'ckarungu921@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || EMAIL_TO;

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing SENDGRID_API_KEY in environment' }), { status: 500 });
    }

    const body = (await req.json()) as ContactPayload;
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const msg = {
      to: EMAIL_TO,
      from: FROM_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
      replyTo: email,
    };

    await sgMail.send(msg as any);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('Contact API error (SendGrid):', err?.message || err);
    const message = err?.response?.body || err?.message || 'Internal error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
