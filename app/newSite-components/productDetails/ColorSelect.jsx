"use client";

import React, { useState, useEffect } from "react";

const colorOptionsDefault = [
  {
    id: "values-beige",
    value: "Beige",
    color: "beige",
  },
  {
    id: "values-gray",
    value: "Gray",
    color: "gray",
  },
  {
    id: "values-grey",
    value: "Grey",
    color: "grey",
  },
];

export default function ColorSelect({
  activeColor = "",
  setActiveColor,
  colorOptions = colorOptionsDefault,
  colors = [],
}) {
  const [colorsOptions, setColorsOptions] = useState([]);
  const [activeColorDefault, setActiveColorDefault] = useState("gray");

  useEffect(() => {
    // console.log(colors, 'colors ---------------------');
    if (colors?.length) {
      const colorsOptionsMap = colors.map((color) => ({
        id: `values-${color.id}`,
        value: color.attributes.color.value,
        color: color.attributes.color.value,
      }));
      setColorsOptions(colorsOptionsMap);
    } else if (colorOptions?.length) {
      setColorsOptions(colorOptions);
    }
  }, [colors, colorOptions]);

  useEffect(() => {
    const options = colors?.length ? colors.map((color) => ({
        color: color.attributes.color.value,
      })) : colorOptions;

    // Check if activeColor is valid, if not select the first one
     if (options.length > 0) {
        const isActiveColorValid = options.some(c => c.color === activeColor);
        if (!isActiveColorValid && options[0].color) {
          const firstColor = options[0].color;
           // Avoid infinite loop by only checking if different and not just setting unconditionally
           // But here we set if not valid.
           if (setActiveColor) {
               setActiveColor(firstColor);
           } else {
               setActiveColorDefault(firstColor);
           }
        }
      }
  }, [colorsOptions, activeColor, setActiveColor]); // Depend on colorsOptions instead of raw props to wait for mapping
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
        {colorsOptions.map(({ id, value, color }) => (
          <React.Fragment key={id}>
            <input
              id={id}
              type="radio"
              readOnly
              checked={
                activeColor ? activeColor == color : activeColorDefault == color
              }
            />
            <label
              onClick={() => {
                handleSelectColor(color);
              }}
              className={`hover-tooltip tooltip-bot radius-60 color-btn ${activeColor
                ? activeColor == color
                  ? "active"
                  : ""
                : activeColorDefault == color
                  ? "active"
                  : ""
                }`}
              htmlFor={id}
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
