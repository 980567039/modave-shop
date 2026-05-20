"use client";

import { useEffect, useRef, useState } from "react";
import Drift from "drift-zoom";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Image from "next/image";
export default function Grid1({
  activeColor = "beige",
  setActiveColor = () => {},
  firstItem,
  items = [],
}) {
  const [finalItem, setFinalItem] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      const itemsFinal = [...items];
      itemsFinal[0].src = firstItem;

      setFinalItem(itemsFinal);
    });
  }, []);
  useEffect(() => {
    // Function to initialize Drift
    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };
    imageZoom();
    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners on component unmount
    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []); // Empty dependency array to run only once on mount

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
    setTimeout(() => {
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
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  return (
    <div className="slider-scroll">
      <div
        className="d-flex flex-column gap-10 wrapper-gallery-scroll"
        id="gallery-started"
      >
        {finalItem.map((link, index) => (
          <a
            href={link.href}
            target={link.target}
            className="item item-scroll-target"
            data-scroll={link.scroll}
            data-pswp-width={`${link.width}px`}
            data-pswp-height={`${link.height}px`}
            key={index}
          >
            <Image
              className="tf-image-zoom lazyload radius-12 w-100"
              data-zoom={link.zoom}
              alt={link.alt}
              src={link.src}
              width={link.width}
              height={link.height}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
