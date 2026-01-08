import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '../hooks';

const About: React.FC = () => {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);

  return (
    <section id="about" className="mt-[40px] py-24 scroll-mt-28 bg-gray-50 dark:bg-[#050505] transition-colors duration-300 min-h-screen" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lg:hidden">
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {t('about.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">{t('about.titleHighlight')}</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-2/5 w-full flex justify-center">
            <div className="relative w-80 h-96 lg:w-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105" onMouseEnter={() => setIsImageHovered(true)} onMouseLeave={() => setIsImageHovered(false)}>
              <img src="/images/VB/cedric.jpeg" alt="Cedric Karungu" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col items-end justify-end transition-opacity duration-300 p-8 ${isImageHovered ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white text-3xl font-bold pb-2">{t('about.name')}</p>
                <p className="text-lg font-medium">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">{t('about.role')}</span>
                  <span className="text-white mx-2">{t('about.separator')}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">{t('about.projectManager')}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-3/5 w-full space-y-6">
            <div className={`hidden lg:block transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">{t('about.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 to-accent-400 dark:from-accent-500 dark:to-white">{t('about.titleHighlight')}</span></h2>
            </div>

            <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-200">{t('about.mainTitle')}</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-white/10 hover:text-accent-600 dark:hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">{t('about.experience')}</span>
                <span className="px-4 py-2 bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-white/10 hover:text-accent-600 dark:hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">{t('about.freelance')}</span>
                <span className="px-4 py-2 bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-white/10 hover:text-accent-600 dark:hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">{t('about.location')}</span>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-400 transform space-y-4 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{t('about.bio1')}</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{t('about.bio2')}</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{t('about.bio3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
