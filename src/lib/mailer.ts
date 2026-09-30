/**
 * Transactional email via Brevo (https://developers.brevo.com/reference/sendtransacemail).
 * Needs BREVO_API_KEY and a sender verified in Brevo (FROM_EMAIL).
 */
const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

export const EMAIL_TO = process.env.EMAIL_TO || 'ckarungu921@gmail.com';
export const FROM_EMAIL = process.env.FROM_EMAIL || EMAIL_TO;
export const FROM_NAME = process.env.FROM_NAME || 'Cédric Karungu';

type Address = { email: string; name?: string };

export type MailInput = {
  to: Address | Address[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: Address;
  tags?: string[];
};

export function isMailConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

export async function sendMail(input: MailInput): Promise<{ messageId: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      textContent: input.text,
      htmlContent: input.html ?? textToHtml(input.text),
      replyTo: input.replyTo,
      tags: input.tags,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Brevo returns { code, message }, e.g. "unauthorized" or an unverified sender.
    throw new Error(`Brevo ${res.status}: ${body.message || body.code || res.statusText}`);
  }
  return { messageId: body.messageId || '' };
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function textToHtml(text: string): string {
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#18181b">${escapeHtml(text).replace(/\n/g, '<br/>')}</div>`;
}
