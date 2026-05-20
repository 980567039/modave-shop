"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const optionsData = [
  {
    value: "us",
    thumbnail: "/newSite-images/country/us.svg",
    text: "USD",
    selected: true,
  },
  {
    value: "vn",
    thumbnail: "/newSite-images/country/vn.svg",
    text: "VND",
  },
];
export default function CurrencySelect({ topStart = false, light = false }) {
  const [selected, setSelected] = useState(optionsData[0]);
  const [isDDOpen, setIsDDOpen] = useState(false);
  const languageSelect = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageSelect.current &&
        !languageSelect.current.contains(event.target)
      ) {
        setIsDDOpen(false); // Close the dropdown if click is outside
      }
    };
    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={languageSelect}
      onClick={() => setIsDDOpen((pre) => !pre)}
      className={`dropdown bootstrap-select image-select center style-default type-currencies ${
        light ? "color-white" : ""
      } dropup`}
    >
      <button
        type="button"
        tabIndex={-1}
        className={`btn dropdown-toggle btn-light  ${isDDOpen ? "show" : ""} `}
        title="USD $ | United States"
      >
        <div className="filter-option">
          <div className="filter-option-inner">
            <div className="filter-option-inner-inner">
              <Image
                src={selected.thumbnail}
                width="640"
                height="480"
                alt="image"
              />
              {selected.text}
            </div>
          </div>{" "}
        </div>
      </button>
      <div
        className={`dropdown-menu ${isDDOpen ? "show" : ""} `}
        style={{
          maxHeight: "899.688px",
          overflow: "hidden",
          minHeight: 0,
          position: "absolute",
          inset: topStart ? "" : "auto auto 0px 0px",
          margin: 0,
          transform: `translate(0px, ${topStart ? 22 : -20}px)`,
        }}
        data-popper-placement={`${!topStart ? "top" : "bottom"}-start`}
      >
        <div
          className="inner show"
          style={{ maxHeight: "869.688px", overflowY: "auto", minHeight: 0 }}
        >
          <ul
            className="dropdown-menu inner show"
            role="presentation"
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            {optionsData.map((elm, i) => (
              <li onClick={() => setSelected(elm)} key={i}>
                <a
                  className={`dropdown-item ${
                    selected == elm ? "active selected" : ""
                  }`}
                >
                  <span className="text">
                    <Image
                      src={elm.thumbnail}
                      width="640"
                      height="480"
                      alt="image"
                    />
                    {elm.text}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
