import React, { useState } from 'react';
import { PROJECTS, Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section 
      id="portfolio" 
      className="py-24 scroll-mt-28 bg-gray-50 dark:bg-black transition-colors duration-300"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/**Section Header with Filter Buttons**/}
        <div className={`flex flex-col md:flex-row justify-between items-end mb-16 gap-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              My projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              Selected projects demonstrating practical solutions and well-architected digital experiences.
            </p>
          </div>
          
          {/**Right Side - Filter Buttons**/}
          <div className="flex gap-2 bg-white dark:bg-black p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
            <button 
              onClick={() => setActiveFilter('All')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'All' 
                  ? 'bg-accent-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('Web')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'Web' 
                  ? 'bg-accent-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Web
            </button>
            <button 
              onClick={() => setActiveFilter('App')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'App' 
                  ? 'bg-accent-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              App
            </button>
          </div>
        </div>

        {/***Projects Grid***/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/**Map through filtered projects to create project cards**/}
          {PROJECTS.filter(project => 
            activeFilter === 'All' || project.category === activeFilter
          ).map((project, idx) => (
            <div 
              key={idx} 
              className={`group relative bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all duration-300 shadow-md dark:shadow-none transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${idx * 75}ms` : '0ms'
              }}
            >
              
              {/***Image Container with Overlay Effect***/}
              <div className="relative h-64 overflow-hidden">

                {/**Dark overlay on hover**/}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 z-10 transition-colors" />
                
                {/**Project Image with Zoom Effect**/}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/****Project Content****/}
              <div className="p-8">
                
                {/***Category and External Link Button***/}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {/**Category Badge**/}
                    <span className="text-accent-600 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    
                    {/**Project Title**/}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  
                  {/***Links - External and GitHub***/}
                  <div className="flex items-center gap-3">
                    {/**External Link Icon**/}
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-accent-600 dark:hover:bg-accent-600 hover:text-white transition-all text-gray-500 dark:text-gray-400 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                      aria-label="Open project website"
                    >
                      <Icons.ExternalLink />
                    </a>
                    {/**GitHub Icon**/}
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-accent-600 dark:hover:bg-accent-600 hover:text-white transition-all text-gray-500 dark:text-gray-400 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                      aria-label="Open project GitHub"
                    >
                      <Icons.Github />
                    </a>
                  </div>
                </div>
                
                {/**Project Description**/}
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/**More Details Link**/}
                <div className="mt-4">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 text-sm font-medium cursor-pointer transition-colors"
                  >
                    more details →
                  </a>
                </div>

                {/**Project Tags**/}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/**See More Projects Button**/}
        <div className={`text-center mt-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <a 
            href="https://github.com/Cedric921" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-600 text-white rounded-full hover:bg-accent-700 transition-colors font-medium cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            See more projects
            <Icons.ExternalLink />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;