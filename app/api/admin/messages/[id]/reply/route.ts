import mongoose from 'mongoose';
import { Message } from '@/lib/models/Message';
import { ok, fail, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';
import { EMAIL_TO, FROM_NAME, escapeHtml, isMailConfigured, sendMail } from '@/lib/mailer';

type Params = { params: Promise<{ id: string }> };

/** Sends the admin's reply to the contact via Brevo and logs it on the message. */
export const POST = withAdmin(async (req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return fail('Invalid id', 400);
  if (!isMailConfigured()) return fail('Email is not configured (BREVO_API_KEY missing)', 503);

  const { body } = await readJson<{ body?: string }>(req);
  const text = body?.trim();
  if (!text) return fail('Reply cannot be empty', 400);
  if (text.length > 20000) return fail('Reply is too long', 413);

  const msg = await Message.findById(id);
  if (!msg) return fail('Not found', 404);

  const subject = /^re:/i.test(msg.subject) ? msg.subject : `Re: ${msg.subject}`;
  const quoted = msg.message.split('\n').map((l) => `> ${l}`).join('\n');
  const when = new Date(msg.createdAt as unknown as string).toUTCString();

  let messageId: string;
  try {
    ({ messageId } = await sendMail({
      to: { email: msg.email, name: msg.name },
      // Replies from the contact land in the admin's inbox.
      replyTo: { email: EMAIL_TO, name: FROM_NAME },
      subject,
      text: `${text}\n\n— ${FROM_NAME}\n\nOn ${when}, ${msg.name} wrote:\n${quoted}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#18181b">
${escapeHtml(text).replace(/\n/g, '<br/>')}
<p style="margin-top:24px">— ${escapeHtml(FROM_NAME)}</p>
<div style="margin-top:24px;padding-left:12px;border-left:3px solid #ddd6fe;color:#71717a;font-size:13px">
<p>On ${escapeHtml(when)}, ${escapeHtml(msg.name)} wrote:</p>
<p>${escapeHtml(msg.message).replace(/\n/g, '<br/>')}</p>
</div></div>`,
      tags: ['contact-reply'],
    }));
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Email send failed', 502);
  }

  const updated = await Message.findByIdAndUpdate(
    id,
    { $push: { replies: { body: text, sentAt: new Date(), messageId } }, $set: { read: true } },
    { new: true },
  ).lean();
  return ok(updated);
});
