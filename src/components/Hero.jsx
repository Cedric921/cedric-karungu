import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const resumePdf = "/document/Ced CV.pdf";


/***Hero Component***/
const Hero = () => {
  // Scroll animation hook
  const { ref, isVisible } = useScrollAnimation(0.2);

  // State variables for the typing animation
const [currentTitle, setCurrentTitle] = useState(''); // Current title being displayed
const [titleIndex, setTitleIndex] = useState(0); // Index of the current title in the titles array
const [isDeleting, setIsDeleting] = useState(false); // Whether we're currently deleting text
const [typingSpeed, setTypingSpeed] = useState(100); // Speed of the typing animation (milliseconds)

// Array of titles to cycle through
const titles = [
  'Full-stack Engineer | Node | TypeScript | React | React Native | Redux',
  'Full-stack Developer | JavaScript | Python | MongoDB | Express',
  'Full-stack Coder | Frontend | Backend | Mobile | Database'
];

// useEffect hook to handle the typing animation
useEffect(() => {
  // Function that handles the typing/deleting logic
  const handleTyping = () => {
    const current = titles[titleIndex]; // Get the current title from the array
    const updatedTitle = isDeleting 
      ? current.substring(0, currentTitle.length - 1) // If deleting, remove one character
      : current.substring(0, currentTitle.length + 1); // If typing, add one character

    setCurrentTitle(updatedTitle); // Update the displayed title

    // Adjust typing speed for a more natural effect
    if (isDeleting) {
      setTypingSpeed(50); // Faster when deleting
    }

    // Logic to determine when to switch between typing and deleting
    if (!isDeleting && updatedTitle === current) {
      setTimeout(() => setIsDeleting(true), 2000); // Pause after finishing typing
    } else if (isDeleting && updatedTitle === '') {
      setIsDeleting(false); // Start typing the next title
      setTitleIndex((prev) => (prev + 1) % titles.length); // Move to next title (circular)
      setTypingSpeed(100); // Reset to normal typing speed
    }
  };

  // Set up the timer for the animation
  const timer = setTimeout(handleTyping, typingSpeed);
  
  // Cleanup function to clear the timer
  return () => clearTimeout(timer);
}, [currentTitle, isDeleting, titleIndex, typingSpeed, titles]); // Dependencies for the effect

  return (
    <section 
      id="about" 
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden scroll-mt-28"
      ref={ref}
    >
      
    {/****BACKGROUND DECORATIVE ELEMENTS****/}

      
      {/**Grid Pattern Background**/}
      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.05] dark:opacity-[0.1] pointer-events-none" />
      
      {/**Gradient Fade Effect - Creates smooth edges from solid to transparent**/}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-[#050505] dark:via-transparent dark:to-[#050505] pointer-events-none" />

      {/**Central Glow Effect - Decorative blur background behind text**/}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent-600/20 dark:bg-accent-600/30 rounded-full blur-[80px] md:blur-[120px] -z-10" />


      {/****CONTENT****/}
      <div className="mt-[40px] relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/**Top Tagline - Availability Badge**/}
        <div className={`mb-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="inline-block py-1 px-3 rounded-full bg-accent-50/50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/50 text-accent-600 dark:text-accent-300 text-sm font-semibold tracking-wide">
            Available for Freelance & Contract
          </span>
        </div>

        {/**Main Name and Title Heading**/}
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-2 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
            CEDRIC KARUNGU
          </span>
          <br />
          
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400">
            Lord Vb
          </span>
        </h1>

        {/***Professional Subtitle with Typing Animation***/}
        <h2 className={`text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-8 mt-10 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span>{currentTitle}</span>
          <span className="animate-pulse">|</span>
        </h2>

        {/**Descriptive Text**/}
        <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          I build systems that run smooth, code that doesn't break, and data that flows right.
        </p>


        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
         {/*Download Resume*/}
          <a
            href={resumePdf}
            download="Ced-CV.pdf"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent-600 hover:bg-accent-500 text-white font-bold transition-all shadow-lg shadow-accent-600/25 flex items-center justify-center gap-2"
          >
            Resume <Icons.Download />
          </a>

          {/*View Work Button*/}
          <a 
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold transition-all flex items-center justify-center gap-2"
          >
            View My Work <Icons.Layout />
          </a>
        </div>

        {/***Social Media Links***/}
        <div className={`flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/*GitHub Link*/}
          <a 
            href="#" 
            className="hover:text-accent-600 dark:hover:text-accent-400 hover:scale-110 transition-all duration-300"
            aria-label="GitHub profile"
          >
            <Icons.Github />
          </a>
          
          {/*LinkedIn Link*/}
          <a 
            href="#" 
            className="hover:text-accent-600 dark:hover:text-accent-400 hover:scale-110 transition-all duration-300"
            aria-label="LinkedIn profile"
          >
            <Icons.Linkedin />
          </a>
          
          {/*Mail Link*/}
          <a 
            href="#" 
            className="hover:text-accent-600 dark:hover:text-accent-400 hover:scale-110 transition-all duration-300"
            aria-label="Mail profile"
          >
            <Icons.Mail />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Hero;