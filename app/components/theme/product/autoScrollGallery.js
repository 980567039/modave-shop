import { useRef, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import ZoomImage from './zoomImage';

const AutoScrollGallery = ({ product, imageGallery, mainImage, isQuickView }) => {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const x = useRef(0);
  const SCROLL_SPEED = 0.8; // Adjust speed as needed

  // Clone items for seamless looping
  useEffect(() => {
    if (innerRef.current && containerRef.current) {
      // Clone the first set of elements and append them to create the loop effect
      const itemsToClone = Array.from(innerRef.current.children);
      itemsToClone.forEach(item => {
        const clone = item.cloneNode(true);
        innerRef.current.appendChild(clone);
      });
    }
  }, []);

  // Auto scroll logic with looping
  useAnimationFrame(() => {
    if (!containerRef.current || !innerRef.current) return;
    
    const { scrollWidth, clientWidth } = containerRef.current;
    const halfScrollWidth = scrollWidth / 2;
    
    // Increment x value for horizontal scrolling
    x.current += SCROLL_SPEED;
    
    // Reset position when we've scrolled through the first set of items
    if (x.current >= halfScrollWidth) {
      x.current = 0;
      containerRef.current.scrollLeft = 0;
    } else {
      // Apply the scroll position
      containerRef.current.scrollLeft = x.current;
    }
  });

  return (
    <motion.div 
      ref={containerRef}
      className='flex overflow-x-hidden '
    //   whileTap={{ cursor: 'grabbing' }}
    >
      <div ref={innerRef} className='flex gap-3'>
        {imageGallery.map((img, index) => (
          <div className='w-[35vw] max-xl:w-[32vw] flex-shrink-0' key={`main-slider-${index}`}>
            <ZoomImage
              src={img}
              alt={`${product?.titleSlug}-${index}`}
              isQuickView={isQuickView}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AutoScrollGallery;