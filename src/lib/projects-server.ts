import { connectDB } from './db';
import { Project } from './models/Project';
import { PROJECTS } from '../constants';
import type { ProjectItem } from './public-data';

/**
 * Published projects for server rendering, with the same static fallback
 * the client uses when the database is empty or unreachable.
 */
export async function getPublicProjectItems(): Promise<ProjectItem[]> {
  try {
    await connectDB();
    const docs = await Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
    if (docs.length) return JSON.parse(JSON.stringify(docs)) as ProjectItem[];
  } catch (err) {
    console.error('[projects] falling back to static data:', err instanceof Error ? err.message : err);
  }
  return PROJECTS as unknown as ProjectItem[];
}
