"use client";

import { useState, useEffect } from "react";
import { onlyFirstLetter } from "@/lib/common";

export default function SizeSelect({ attributes, selectedSize, setSelectedSize }) {
  
  const handleChange = (value) => {
    setSelectedSize(value);
  };

  return (
    <div className="variant-picker-item">
      <div className="d-flex justify-content-between mb_12">
        <div className="variant-picker-label">
          selected size:
          <span className="text-title variant-picker-label-value">
            {selectedSize}
          </span>
        </div>
        <a
          href="#size-guide"
          data-bs-toggle="modal"
          className="size-guide text-title link"
        >
          Size Guide
        </a>
      </div>
      <div className="variant-picker-values gap12">
        {attributes?.map(({ id, price, disabled, attributes }) => (
          <div key={id} onClick={() => handleChange(attributes.size.value)}>
            <input
              type="radio"
              id={id}
              checked={selectedSize === attributes.size.value}
              disabled={disabled}
              readOnly
            />
            <label
              className={`style-text size-btn ${disabled ? "type-disable" : ""
                }`}
              htmlFor={id}
              data-value={attributes.size.value}
              data-price={price}
            >
              <span className="text-title">{onlyFirstLetter(attributes.size.value)}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
