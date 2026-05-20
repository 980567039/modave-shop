import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import useMediaQuery from '@/app/hooks/useMediaQuery';

const ZoomImage = ({ 
    src, 
    alt, 
    isQuickView = false, 
    zoomScale = 2.5,
    isVisible = true // New prop to track visibility
}) => {
    const [isZooming, setIsZooming] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    
    // Reset zoom state when visibility changes
    useEffect(() => {
        if (!isVisible) {
            setIsZooming(false);
        }
    }, [isVisible]);

    const handleMouseMove = (e) => {
        if (!imageRef.current || !isVisible) return;

        const rect = imageRef.current.getBoundingClientRect();
        
        // Calculate cursor position relative to image
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setPosition({ x, y });
    };
    
    // Only enable zoom functionality if the image is visible
    const handleMouseEnter = () => {
        if (isVisible) {
            setIsZooming(true);
        }
    };

    const containerClasses = `
        relative
        overflow-hidden
        rounded-2xl
        ${isQuickView ? 'w-full' : 'w-10/12 sticky top-0'}
        ${isQuickView ? 'lg:w-full' : 'w-full'}
    `;

    const imageClasses = `
        w-full
        h-auto
        transition-transform duration-200
        ${isZooming ? 'scale-150' : 'scale-100'}
    `;

    const zoomStyle = isZooming ? {
        transformOrigin: `${position.x}% ${position.y}%`,
        transform: `scale(${zoomScale})`
    } : {};

    return (
        <div 
            className={containerClasses}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            ref={imageRef}
            data-visible={isVisible ? "true" : "false"} // Add data attribute for debugging
        >
            <img
                src={src || 'https://dummyimage.com/800x800/ddd/000'}
                alt={alt || 'Product Image'}
                width={isDesktop ? 1300 : 800}
                height={isDesktop ? 1000 : 600}
                style={{
                    ...zoomStyle,
                    height: 'auto',
                    maxWidth: '100%'
                }}
                className={imageClasses}
                loading="lazy"
                unoptimized={isDesktop}
            />
        </div>
    );
};

export default ZoomImage;