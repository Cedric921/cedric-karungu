import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`);
    router.push(newPathname);
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
            currentLocale === lang.code
              ? 'bg-accent-600 text-white'
              : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
