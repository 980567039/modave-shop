"use client";
import React, { useState } from "react";
import Image from "next/image";
const colorOptionsRounded = [
  {
    id: "values-white",
    name: "color1",
    value: "White",
    color: "white",
    imgSrc: "/newSite-images/products/item/img-rounded-1.jpg",
    imgAlt: "White color",
  },
  {
    id: "values-gray",
    name: "color1",
    value: "Gray",
    color: "gray",
    imgSrc: "/newSite-images/products/item/img-rounded-2.jpg",
    imgAlt: "Gray color",
  },
  {
    id: "values-green",
    name: "color1",
    value: "Green",
    color: "green",
    imgSrc: "/newSite-images/products/item/img-rounded-3.jpg",
    imgAlt: "Green color",
  },
];

export default function ColorSelect5({ activeColor = "", setActiveColor }) {
  const [activeColorDefault, setActiveColorDefault] = useState("beige");

  const handleSelectColor = (value) => {
    if (setActiveColor) {
      setActiveColor(value);
    } else {
      setActiveColorDefault(value);
    }
  };
  return (
    <div className="variant-picker-item">
      <div className="variant-picker-label mb_12">
        Colors:
        <span className="text-title variant-picker-label-value value-currentColor">
          {activeColor || activeColorDefault}
        </span>
      </div>
      <div className="variant-picker-values">
        {colorOptionsRounded.map((option) => (
          <React.Fragment key={option.id}>
            <input id={option.id} type="radio" name={option.name} readOnly />
            <label
              className={`style-image-rounded hover-tooltip tooltip-bot color-btn ${
                activeColor == option.color ? "active" : ""
              } `}
              htmlFor={option.id}
              onClick={() => handleSelectColor(option.color)}
            >
              <Image
                className="ls-is-cached lazyloaded"
                data-src={option.imgSrc}
                alt={option.imgAlt}
                src={option.imgSrc}
                width={80}
                height={80}
              />
              <span className="tooltip">{option.value}</span>
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
