'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Button, Input, Label, Card, Spinner } from '@/components/admin/ui';
import { LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const search = useSearchParams();
  const locale = params?.locale || 'en';
  const next = search.get('next') || `/${locale}/admin`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json?.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] px-4">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent-700/10 rounded-full blur-3xl" />
      </div>
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10 ring-1 ring-accent-500/20 mb-3">
            <LogIn className="text-accent-600 dark:text-accent-400" size={20} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin sign in</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access the portfolio dashboard
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner /> : <LogIn size={16} />}
            <span>{loading ? 'Signing in…' : 'Sign in'}</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
