// src/components/MagicalCursor.jsx
"use client"; // Add this line

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagicalCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      const target = e.target;
      setIsHovering(target.matches('button, a, input, [role="button"]'));
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        className={`magical-cursor ${isHovering ? 'hover' : ''}`}
        initial={{ x: position.x, y: position.y }}
        animate={{
          x: position.x - 10,
          y: position.y - 10,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
        style={{
          position: 'absolute',
          boxShadow: '0 0 20px #fff, 0 0 30px #fff',
        }}
      />
    </div>
  );
}