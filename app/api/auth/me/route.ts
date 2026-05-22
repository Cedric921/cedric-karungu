import { getSessionFromCookies } from '@/lib/auth';
import { ok, fail, handleError } from '@/lib/api';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) return fail('Unauthorized', 401);
    return ok({ email: session.email, role: session.role });
  } catch (err) {
    return handleError(err);
  }
}
