"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPathname);
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <div className="flex items-center">
      <label htmlFor="locale-select" className="sr-only">Language</label>
      <select
        id="locale-select"
        value={currentLocale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-3 py-1.5 rounded-md text-sm font-medium bg-white dark:bg-[#0b0b0b] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>{`${lang.flag} ${lang.label}`}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
