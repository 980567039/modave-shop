import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HoverImageLink = ({
    url,
    title,
    image
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const linkRef = useRef(null);

  const handleMouseMove = (e) => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="relative">
      <Link 
        href={url || '#'} 
        className="flex items-center gap-2 group relative hover:px-3 py-2 transition-all z-20 text-xs w-max-content mix-blend-difference"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        ref={linkRef}
      >
        <ArrowRight 
          size={10} 
          className="transition-all ease-in-out duration-300 absolute left-0 opacity-0 group-hover:opacity-100"
        />
        <span className="block transition-all duration-300 drop-shadow-lg ">{title}</span>
      </Link>

      {isHovered && image && (
        <motion.div
          className="absolute pointer-events-none z-10"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden">
            <Image
              src={image} // Replace with your image path
              alt={title || ''}
              width={100}
              height={100}
              className="object-cover"
              unoptimized={true}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HoverImageLink;