import React from 'react';
import { EXPERIENCES, Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const Experience: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <section id="experience" className="py-24 bg-white dark:bg-[#050505] scroll-mt-28 transition-colors duration-300" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Professional Experience</h2>
          <p className="text-gray-600 dark:text-gray-400">My journey through the tech industry.</p>
        </div>

        <div className="relative space-y-12">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-600 via-gray-200 dark:via-white/10 to-transparent md:-translate-x-1/2" />

          {EXPERIENCES.map((exp, index) => (
            <div key={exp.id} className={`relative flex flex-col md:flex-row gap-8 transition-all duration-1000 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}>
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white dark:bg-[#050505] border-2 border-accent-500 rounded-full translate-y-1.5 md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(124,58,237,0.5)]" />

              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all duration-300 group shadow-sm dark:shadow-none">
                  <div className={`flex flex-col gap-1 mb-4 ${index % 2 === 0 ? 'items-start' : 'items-start md:items-end'}`}>
                    <span className="px-3 py-1 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-xs font-semibold border border-accent-200 dark:border-accent-500/20">{exp.period}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">{exp.role}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">{exp.company}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">{exp.location}</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;