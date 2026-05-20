"use client";
import React, { useState } from "react";
import Image from "next/image";
const colorOptions = [
  {
    id: "values-orange",
    name: "color1",
    color: "orange",
    imageSrc: "images/products/sneaker/color-1.jpg",
    tooltip: "Orange",
    defaultChecked: false,
  },
  {
    id: "values-green",
    name: "color1",
    color: "green",
    imageSrc: "images/products/sneaker/color-2.jpg",
    tooltip: "Green",
    defaultChecked: true,
  },
];

export default function ColorSelect9() {
  const [selectedColor, setSelectedColor] = useState("green"); // Default selected color

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <>
      <div className="variant-picker-label mb_12">
        Colors:
        <span className="text-title variant-picker-label-value value-currentColor">
          {selectedColor}
        </span>
      </div>
      <div className="variant-picker-values gap-0">
        {colorOptions.map((option) => (
          <React.Fragment key={option.id}>
            <input
              id={option.id}
              type="radio"
              name={option.name}
              defaultChecked={option.defaultChecked}
              onChange={() => handleColorChange(option.color)}
            />
            <label
              className={`style-image hover-tooltip tooltip-bot color-btn ${
                selectedColor === option.color ? "active" : ""
              }`}
              style={{ height: 72 }}
              htmlFor={option.id}
              data-value={option.color}
              data-color={option.color}
            >
              <Image
                className="ls-is-cached lazyloaded"
                data-src={option.imageSrc}
                alt=""
                src={option.imageSrc}
                width={60}
                height={60}
              />
              <span className="tooltip">{option.tooltip}</span>
            </label>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
