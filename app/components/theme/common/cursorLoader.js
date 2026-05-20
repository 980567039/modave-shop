// components/CursorLoader.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CursorLoader = ({
  color = '#0070f3',
  size = 40,
  offset = { x: 20, y: 20 }
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle page load
  useEffect(() => {
    // Start loading
    setIsLoading(true);

    // This runs when the component mounts (page starts loading)
    const handleLoad = () => {
      // Add some delay to make the loading animation visible
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // You can adjust this time or use actual load detection
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  // Listen for route changes in Next.js
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 800);
    };

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);
    
    // In Next.js 14+
    if (typeof window !== 'undefined' && window.navigation) {
      const navigation = window.navigation;
      navigation.addEventListener('navigate', handleStart);
      navigation.addEventListener('navigatesuccess', handleComplete);
      navigation.addEventListener('navigateerror', handleComplete);
      
      return () => {
        navigation.removeEventListener('navigate', handleStart);
        navigation.removeEventListener('navigatesuccess', handleComplete);
        navigation.removeEventListener('navigateerror', handleComplete);
      };
    }

    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{
            position: 'fixed',
            left: mousePosition.x + offset.x,
            top: mousePosition.y + offset.y,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              border: `3px solid rgba(255, 255, 255, 0.2)`,
              borderTop: `3px solid ${color}`,
              boxShadow: `0 0 10px rgba(0, 0, 0, 0.1)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CursorLoader;