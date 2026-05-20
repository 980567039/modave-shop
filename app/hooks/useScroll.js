"use client"
import { useState, useEffect } from 'react';

const useScroll = () => {
  const [scrolledTopValue, setScrolledTopValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolledTopValue(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrolledTopValue;
};

export default useScroll;