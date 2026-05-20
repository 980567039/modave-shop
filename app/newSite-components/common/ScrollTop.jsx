"use client";

import { useEffect, useState } from "react";

export default function ScrollTop({ hasPaddingBottom = false }) {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.scrollY; // Get the vertical scroll position

      if (scrollTop > 500 && !isButtonVisible) {
        setIsButtonVisible(true);
      } else if (scrollTop <= 500 && isButtonVisible) {
        setIsButtonVisible(false);
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(checkScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isButtonVisible]);

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      id="scroll-top"
      className={`scroll-top-button ${hasPaddingBottom ? "type-1" : ""} ${
        isButtonVisible ? "show" : ""
      }`}
      onClick={handleScrollToTop}
    >
      <svg
        width={24}
        height={25}
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_15741_24194)">
          <path
            d="M3 11.9175L12 2.91748L21 11.9175H16.5V20.1675C16.5 20.3664 16.421 20.5572 16.2803 20.6978C16.1397 20.8385 15.9489 20.9175 15.75 20.9175H8.25C8.05109 20.9175 7.86032 20.8385 7.71967 20.6978C7.57902 20.5572 7.5 20.3664 7.5 20.1675V11.9175H3Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_15741_24194">
            <rect
              width={24}
              height={24}
              fill="white"
              transform="translate(0 0.66748)"
            />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}
