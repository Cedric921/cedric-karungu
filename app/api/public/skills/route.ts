import { Skill } from '@/lib/models/Skill';
import { ok } from '@/lib/api';
import { withPublic } from '@/lib/handler';

export const GET = withPublic(async () => {
  const items = await Skill.find({ published: true }).sort({ category: 1, order: 1 }).lean();
  return ok(items);
});
