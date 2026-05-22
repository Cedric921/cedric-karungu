'use client';

import React, { useState } from 'react';
import { cn } from './ui';

const LOCALES = ['en', 'fr', 'es'] as const;
type LocaleCode = (typeof LOCALES)[number];

export type Localized = { en: string; fr: string; es: string };

type Props = {
  value: Localized;
  onChange: (next: Localized) => void;
  renderInput: (locale: LocaleCode, value: string, set: (v: string) => void) => React.ReactNode;
  label?: string;
};

export function LocaleTabs({ value, onChange, renderInput, label }: Props) {
  const [active, setActive] = useState<LocaleCode>('en');
  const set = (locale: LocaleCode) => (v: string) => onChange({ ...value, [locale]: v });

  return (
    <div>
      {label && (
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
          {label}
        </div>
      )}
      <div className="flex items-center gap-1 mb-2">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setActive(l)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide transition',
              active === l
                ? 'bg-accent-500/15 text-accent-700 dark:text-accent-300 ring-1 ring-accent-500/30'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            )}
          >
            {l}
            {value[l]?.trim() ? '' : ' •'}
          </button>
        ))}
      </div>
      <div>{renderInput(active, value[active] || '', set(active))}</div>
    </div>
  );
}
