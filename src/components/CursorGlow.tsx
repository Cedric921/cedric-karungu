import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorGlow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="fixed w-96 h-96 rounded-full pointer-events-none z-10 mix-blend-screen"
      style={{
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.6) 0%, rgba(124, 58, 237, 0.2) 30%, transparent 70%)',
        filter: 'blur(50px)',
      }}
      animate={{
        x: mousePosition.x - 192,
        y: mousePosition.y - 192,
        opacity: isVisible ? 0.8 : 0,
      }}
      transition={{
        type: 'spring',
        damping: 25,
        mass: 1,
        stiffness: 80,
      }}
    />
  );
};

export default CursorGlow;
