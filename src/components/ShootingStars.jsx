// src/components/ShootingStars.jsx
"use client"; // Add this line

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ShootingStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const createStar = () => {
      const newStar = {
        id: Date.now(),
        delay: Math.random() * 2,
        top: Math.random() * window.innerHeight,
        left: Math.random() * window.innerWidth + window.innerWidth,
      };
      setStars((prev) => [...prev, newStar]);
      setTimeout(() => {
        setStars((prev) => prev.filter((star) => star.id !== newStar.id));
      }, 5000);
    };

    const interval = setInterval(createStar, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="shooting-star"
          initial={{ x: star.left, y: star.top }}
          animate={{
            x: -100,
            y: star.top + 100,
          }}
          transition={{
            duration: 5,
            delay: star.delay,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            boxShadow: '0 0 20px #fff, 0 0 30px #fff',
          }}
        />
      ))}
    </div>
  );
}