"use client";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useRef } from "react";
import Image from "next/image";
export default function Grid4({
  activeColor = "gray",
  setActiveColor = () => {},
  gridImages = [],
}) {
  const lightboxRef = useRef(null);
  useEffect(() => {
    // Initialize PhotoSwipeLightbox
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-started",
      children: ".item",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    // Store the lightbox instance in the ref for later use
    lightboxRef.current = lightbox;

    // Cleanup: destroy the lightbox when the component unmounts
    return () => {
      lightbox.destroy();
    };
  }, []);

  const observerRef = useRef(null);

  const scrollToTarget = () => {
    // Find the element with the specific data-value attribute
    const heightScroll = window.scrollY;
    const targetElement = document.querySelector(
      `[data-scroll='${activeColor}']`
    );

    // Check if the element exists
    if (targetElement) {
      // Get the element's bounding rectangle
      setTimeout(() => {
        if (window.scrollY == heightScroll) {
          targetElement?.scrollIntoView({
            behavior: "smooth", // Smooth scrolling animation
            block: "center", // Center the element in the viewport
          });
        }
      }, 200);

      // Scroll only if the element is not already in view
    }
  };

  useEffect(() => {
    scrollToTarget();
  }, [activeColor]);

  useEffect(() => {
    const options = {
      rootMargin: "-50% 0px",
    };
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const scrollValue = entry.target.getAttribute("data-scroll");
          setActiveColor(scrollValue);
        }
      });
    }, options);

    // Observe all items
    const elements = document.querySelectorAll(".item-scroll-target");
    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  return (
    <div className="grid-image-top" id="gallery-started">
      {gridImages.slice(0, 2).map((image, index) => (
        <a
          key={index}
          href={image.src}
          target="_blank"
          className={`item ${image.itemClass} w-100`}
          data-pswp-width={image.dataPswdWidth}
          data-pswp-height={image.dataPswdHeight}
        >
          <Image
            className="lazyload radius-12"
            data-src={image.src}
            alt={image.alt}
            src={image.src}
            width={image.width}
            height={image.height}
          />
        </a>
      ))}

      <div className="w-100">
        {gridImages.slice(2).map((image, index) => (
          <a
            key={index}
            href={image.src}
            target="_blank"
            className={`item ${image.itemClass} w-100`}
            data-pswp-width={image.dataPswdWidth}
            data-pswp-height={image.dataPswdHeight}
          >
            <Image
              className="lazyload radius-12"
              data-src={image.src}
              alt={image.alt}
              src={image.src}
              width={image.width}
              height={image.height}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
