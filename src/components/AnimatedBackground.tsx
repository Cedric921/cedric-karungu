import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      setIsMoving(true);
    };

    const handleMouseLeave = () => {
      setIsMoving(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Mouse-following gradient circle */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
        }}
        animate={{
          x: isMoving ? mousePosition.x - 192 : 0,
          y: isMoving ? mousePosition.y - 192 : 0,
        }}
        transition={{ type: 'spring', damping: 50, mass: 1, stiffness: 100 }}
      />

      {/* Static floating gradients */}
      <div className="absolute inset-0">
        {/* Top left animated gradient */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />

        {/* Bottom right animated gradient */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 1,
          }}
        />

        {/* Center animated gradient */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />

        {/* Extra accent gradient */}
        <motion.div
          className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, 50, -50, 0],
            x: [0, -20, 20, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
};

export default AnimatedBackground;
