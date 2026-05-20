import Image from 'next/image';

const Picture = ({ 
  mobileSrc, 
  desktopSrc, 
  alt, 
  mobileWidth, 
  mobileHeight,
  desktopWidth,
  desktopHeight, 
  className
}) => {
  return (
    <picture >
      <source
        media="(max-width: 767px)"
        srcSet={mobileSrc}
      />
      <source
        media="(min-width: 768px)"
        srcSet={desktopSrc}
      />
      <Image
        src={desktopSrc}
        alt={alt}
        width={desktopWidth}
        height={desktopHeight}
        sizes="100vw"
        className={className}
        unoptimized={true}
      />
    </picture>
  );
};

export default Picture;