import { useState, useEffect, useRef } from 'react';

// Custom hook to trigger animations when elements scroll into view
export const useScrollAnimation = (threshold = 0.1) => {
  // State to track if the element is visible in the viewport
  const [isVisible, setIsVisible] = useState(false);
  
  // Reference to the DOM element we want to observe
  const ref = useRef(null);

  // Set up Intersection Observer when component mounts
  useEffect(() => {
    // Create observer to watch when element enters viewport
    const observer = new IntersectionObserver(
      // Callback function that runs when visibility changes
      ([entry]) => {
        // If element is now visible in viewport
        if (entry.isIntersecting) {
          // Set state to trigger animations
          setIsVisible(true);
          
          // Stop observing to save memory after animation triggers
          observer.unobserve(entry.target);
        }
      },
      // Configuration: trigger when specified percentage is visible
      { threshold }
    );

    // Start observing the element if reference exists
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup: stop observing when component unmounts
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]); // Re-run effect if threshold value changes

  // Return ref to attach to element and visibility state
  return { ref, isVisible };
};