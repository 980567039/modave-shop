"use client";
import React, { useState } from "react";
const colors = [
  { name: "Gray", value: "gray" },
  { name: "Beige", value: "beige" },
  { name: "Grey", value: "grey" },
];
export default function ColorSelect6({ activeColor = "", setActiveColor }) {
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
      <div
        className="tf-dropdown-sort style-1 full position-relative"
        data-bs-toggle="dropdown"
        aria-expanded="true"
      >
        <div className="btn-select">
          <span className="text-sort-value select-currentColor">
            {activeColor || activeColorDefault}
          </span>
          <span className="icon icon-arrow-down" />
        </div>
        <div className="dropdown-menu" data-popper-placement="bottom-start">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`select-item color-btn ${
                activeColor === color.value ? "active" : ""
              }`}
              onClick={() => handleSelectColor(color.value)}
            >
              <span className="text-value-item">{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
