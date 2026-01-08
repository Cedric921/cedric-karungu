import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SKILLS } from '../constants';
import { useScrollAnimation } from '../hooks';

const Skills: React.FC = () => {
  const t = useTranslations();
  const [activeFilter, setActiveFilter] = useState(t('skills.frontEnd'));
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="skills" className=" py-24 bg-white dark:bg-[#100B17] scroll-mt-28 transition-colors duration-300" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{t('skills.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('skills.description')}</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex gap-2 bg-white dark:bg-black p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
            <button onClick={() => setActiveFilter(t('skills.frontEnd'))} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === t('skills.frontEnd') ? 'bg-accent-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{t('skills.frontEnd')}</button>
            <button onClick={() => setActiveFilter(t('skills.backEnd'))} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === t('skills.backEnd') ? 'bg-accent-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{t('skills.backEnd')}</button>
            <button onClick={() => setActiveFilter(t('skills.ai'))} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === t('skills.ai') ? 'bg-accent-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>{t('skills.ai')}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {SKILLS.filter(skill => skill.category === activeFilter).map((skill, idx) => (
            <div key={idx} className={`bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 rounded-2xl hover:border-accent-500/50 hover:bg-accent-500/5 transition-all duration-300 flex flex-col items-center justify-center gap-6 text-center cursor-default shadow-lg dark:shadow-none transform transition-all ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: isVisible ? `${idx * 50}ms` : '0ms' }}>
              <div className="text-5xl mb-4">
                <img src={skill.logoUrl} alt={skill.name} className="w-12 h-12 dark:hidden" />
                <img src={skill.logoUrl} alt={skill.name} className="w-12 h-12 hidden dark:block" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3">{skill.name}</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${skill.level === 'Expert' ? 'bg-green-500' : skill.level === 'Advanced' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
