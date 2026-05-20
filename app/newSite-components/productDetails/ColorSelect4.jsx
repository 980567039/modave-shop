"use client";
import React, { useState } from "react";
import Image from "next/image";
const colorOptions = [
  {
    id: "values-beige",
    name: "color1",
    value: "Beige",
    color: "beige",
    imgSrc: "/newSite-images/products/womens/women-6.jpg",
    imgAlt: "Beige color",
  },
  {
    id: "values-gray",
    name: "color1",
    value: "Gray",
    color: "gray",
    imgSrc: "/newSite-images/products/womens/women-3.jpg",
    imgAlt: "Gray color",
  },
  {
    id: "values-grey",
    name: "color1",
    value: "Grey",
    color: "grey",
    imgSrc: "/newSite-images/products/womens/women-23.jpg",
    imgAlt: "Grey color",
  },
];

export default function ColorSelect4({ activeColor = "", setActiveColor }) {
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
        {colorOptions.map((option) => (
          <React.Fragment key={option.id}>
            <input id={option.id} type="radio" name={option.name} readOnly />
            <label
              className={`style-image hover-tooltip tooltip-bot color-btn  ${
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
                width={600}
                height={800}
              />
              <span className="tooltip">{option.value}</span>
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
