import { Project } from '@/lib/models/Project';
import { ok } from '@/lib/api';
import { withPublic } from '@/lib/handler';

export const GET = withPublic(async () => {
  const items = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
  return ok(items);
});
