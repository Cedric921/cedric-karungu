'use client';

import React from 'react';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };
  const variants = {
    primary:
      'bg-accent-600 hover:bg-accent-500 text-white shadow-sm shadow-accent-600/30 focus:ring-accent-500',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 focus:ring-accent-500',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-white/5 dark:text-gray-300 focus:ring-accent-500',
    danger:
      'bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-600/30 focus:ring-red-500',
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full h-10 px-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition',
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500 transition resize-y min-h-[96px]',
        props.className
      )}
    />
  );
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5"
    >
      {children}
    </label>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'success' | 'danger' | 'warning';
}) {
  const tones = {
    neutral: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300',
    accent: 'bg-accent-500/10 text-accent-700 dark:text-accent-300 ring-1 ring-accent-500/20',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20',
    danger: 'bg-red-500/10 text-red-700 dark:text-red-300 ring-1 ring-red-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-700 dark:text-gray-300 font-medium">{title}</div>
      {hint && <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{hint}</div>}
    </div>
  );
}
