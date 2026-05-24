import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-br from-surface-50 via-emerald-50/40 to-amber-50/40 dark:from-surface-950 dark:via-zinc-900 dark:to-surface-950">
      {/* Mouse-following glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.7) 0%, rgba(245, 158, 11, 0.3) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: isMoving ? mousePosition.x - 192 : -192,
          y: isMoving ? mousePosition.y - 192 : -192,
          opacity: isMoving ? 0.6 : 0.2,
        }}
        transition={{
          type: "spring",
          damping: 20,
          mass: 1,
          stiffness: 60,
        }}
      />

      {/* Animated floating orbs */}
      <div className="absolute inset-0">
        {/* Large primary orb - top left */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 80%)",
            filter: "blur(80px)",
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />

        {/* Secondary orb - bottom right */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)",
            filter: "blur(70px)",
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tertiary orb - center */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 80%)",
            filter: "blur(100px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [0.9, 1.1, 0.9],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Small accent orb - top right */}
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 80%)",
            filter: "blur(60px)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Bottom left secondary accent */}
        <motion.div
          className="absolute -bottom-32 -left-20 w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 80%)",
            filter: "blur(70px)",
          }}
          animate={{
            y: [0, 50, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Subtle gradient mesh overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(16, 185, 129, 0.04) 35%, rgba(245, 158, 11, 0.04) 65%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
