import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { comparePassword, signSession, setSessionCookie } from '@/lib/auth';
import { ok, fail, handleError, readJson } from '@/lib/api';

type Body = { email?: string; password?: string };

export async function POST(req: Request) {
  try {
    const { email, password } = await readJson<Body>(req);
    if (!email || !password) return fail('Email and password are required', 400);

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return fail('Invalid credentials', 401);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return fail('Invalid credentials', 401);

    const token = await signSession({
      sub: String(user._id),
      email: user.email,
      role: 'admin',
    });
    await setSessionCookie(token);

    return ok({ email: user.email, name: user.name || '' });
  } catch (err) {
    return handleError(err);
  }
}
