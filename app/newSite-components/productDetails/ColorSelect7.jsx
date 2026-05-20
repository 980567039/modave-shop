import React, { useState } from "react";
const colors = [
  {
    name: "Gray",
    price: 79.99,
    valueColor: "#4D4E4F",
    bgClass: "bg-color-gray",
    value: "gray",
  },
  {
    name: "Beige",
    price: 89.99,
    valueColor: "#dfc6b8",
    bgClass: "bg-color-beige1",
    value: "beige",
  },
  {
    name: "Grey",
    price: 89.99,
    valueColor: "#9e9b96",
    bgClass: "bg-color-grey",
    value: "grey",
  },
];
export default function ColorSelect7({ activeColor = "", setActiveColor }) {
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
        className="tf-dropdown-sort full style-1 has-color"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className="btn-select">
          <span
            className={`current-color box-color d-inline-block rounded-full bg-color-${activeColor}`}
            style={{ background: "bg-color-" + activeColor }}
          />
          <span className="text-sort-value flex-grow-1 select-currentColor">
            {activeColor || activeColorDefault}
          </span>
          <span className="icon icon-arrow-down" />
        </div>
        <div className="dropdown-menu">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`select-item color-btn ${
                activeColor === color.value ? "active" : ""
              }`}
              onClick={() => handleSelectColor(color.value)}
            >
              <span
                className={`box-color d-inline-block rounded-full ${color.bgClass}`}
                style={{ background: color.valueColor }}
              />
              <span className="text-value-item">{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
