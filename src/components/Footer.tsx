import React from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../constants';

const Footer: React.FC = () => {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <a href="#" className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white hover:text-accent-600 dark:hover:text-accent-400 transition-colors inline-block mb-4">CK<span className="text-accent-500">.</span></a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">I build scalable full-stack systems with clean architecture, solid backend logic, and production-ready user experiences. Focused on code quality, maintainability, and real-world performance.</p>

            <div className="space-y-3">
              <a href="mailto:ckarungu921@gmail.com" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 group">
                <span className="group-hover:scale-110 transition-transform duration-200"><Icons.Mail /></span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">ckarungu921@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">{t('footer.links')}</h3>
            <ul className="space-y-3">
              {[{ name: t('nav.home'), href: '#home' },{ name: t('nav.about'), href: '#about' },{ name: t('nav.skills'), href: '#skills' },{ name: t('nav.projects'), href: '#portfolio' },{ name: t('nav.experience'), href: '#experience' },{ name: t('nav.contact'), href: '#contact' }].map((link) => (
                <li key={link.name}><a href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Featured Work</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://home-adminatete.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">AdminAtete</span>
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"><Icons.ExternalLink /></span>
                </a>
              </li>
              <li>
                <a href="https://le-cres.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">CRES Startup</span>
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"><Icons.ExternalLink /></span>
                </a>
              </li>
              <li>
                <a href="https://www.kadea.academy/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5 group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">KADEA Academy</span>
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"><Icons.ExternalLink /></span>
                </a>
              </li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-white transition-colors duration-200 cursor-default">Ever Technologies Projects</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-white transition-colors duration-200 cursor-default">Buku My Class</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-6">{['PostgreSQL','JavaScript','Web Application','RESTful API','Git','GitHub','Database','ExpressJS','TypeScript','Node.js','React Native','React','Redux','HTML5','CSS 3'].map((tech) => (
              <span key={tech} className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-white/10 hover:border-accent-500 dark:hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 transition-all duration-200 cursor-default">{tech}</span>
            ))}</div>

            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Connect</h3>
            <div className="flex gap-4">
              <a href="https://github.com/Cedric921" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 hover:scale-110 hover:-rotate-6" aria-label="GitHub Profile"><Icons.Github /></a>
              <a href="https://linkedin.com/in/cedric-karungu" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 hover:scale-110 hover:rotate-6" aria-label="LinkedIn Profile"><Icons.Linkedin /></a>
              <a href="mailto:ckarungu921@gmail.com" className="text-gray-500 dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-all duration-200 hover:scale-110 hover:-translate-y-1" aria-label="Email Contact"><Icons.Mail /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-left">© {currentYear} Cédric Karungu. {t('footer.copyright')}</p>
            <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-500">
              <span className="hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-200">Fullstack Software Developer</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-200 cursor-default">Open to Remote Opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
