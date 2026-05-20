"use client";

import React, { useState } from "react";

const colorOptions = [
  {
    id: "values-beige",
    value: "Beige",
    color: "beige",
    price: "",
    checked: false,
  },
  {
    id: "values-gray",
    value: "Gray",
    color: "gray",
    price: "79.99",
    checked: true,
    soldOut: true,
  },
  {
    id: "values-grey",
    value: "Grey",
    color: "grey",
    price: "89.99",
    checked: false,
  },
];

export default function ColorSelect8({ activeColor = "", setActiveColor }) {
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
        <span
          className="text-title variant-picker-label-value value-currentColor"
          style={{ textTransform: "capitalize" }}
        >
          {activeColor || activeColorDefault}
        </span>
      </div>
      <div className="variant-picker-values">
        {colorOptions.map(({ id, value, color, price, soldOut }) => (
          <React.Fragment key={id}>
            <input
              id={id}
              type="radio"
              name="color1"
              readOnly
              checked={
                activeColor ? activeColor == color : activeColorDefault == color
              }
            />
            <label
              onClick={() => handleSelectColor(color)}
              className={`hover-tooltip tooltip-bot radius-60 color-btn ${
                soldOut ? "type-sold-out" : ""
              } ${
                activeColor
                  ? activeColor == color
                    ? "active"
                    : ""
                  : activeColorDefault == color
                  ? "active"
                  : ""
              }`}
              htmlFor={id}
              data-value={value}
              data-color={color}
              data-price={price}
            >
              <span className={`btn-checkbox bg-color-${color}`} />
              <span className="tooltip">{value}</span>
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
