"use client";

import { useEffect, useState } from "react";

export default function RtlToggler() {
  // Initialize state with the value from localStorage, or default to false
  const [isRtl, setIsRtl] = useState(false);
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setShowText(true);
    const savedRtl = localStorage.getItem("isRtl");

    setIsRtl(savedRtl ? JSON.parse(savedRtl) : false);
  }, []);

  const handleRtl = (value) => {
    setIsRtl(value);
    // Save the state to localStorage
    localStorage.setItem("isRtl", JSON.stringify(value));
  };

  useEffect(() => {
    if (isRtl) {
      document.body.classList.add("rtl");
      document.dir = "rtl";
    } else {
      document.body.classList.remove("rtl");
      document.dir = "ltr";
    }
  }, [isRtl]);

  return (
    <>
      {showText && (
        <a
          id="toggle-rtl"
          onClick={() => handleRtl(!isRtl)}
          className="btn-style-2 radius-3"
        >
          {typeof window !== "undefined" && <>{isRtl ? "ltr" : "rtl"} </>}
        </a>
      )}
    </>
  );
}
