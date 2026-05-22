import { Message } from '@/lib/models/Message';
import { ok } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

export const GET = withAdmin(async (req) => {
  const url = new URL(req.url);
  const filter: Record<string, unknown> = {};
  const status = url.searchParams.get('status');
  if (status === 'unread') filter.read = false;
  if (status === 'read') filter.read = true;
  if (status === 'archived') filter.archived = true;

  const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);
  const skip = Number(url.searchParams.get('skip') || 0);

  const [items, total, unread] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Message.countDocuments(filter),
    Message.countDocuments({ read: false, archived: false }),
  ]);

  return ok({ items, total, unread, limit, skip });
});
