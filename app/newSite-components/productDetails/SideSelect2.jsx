"use client";
import React, { useState } from "react";

const SizeSelector = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="tf-sticky-atc-size d-flex gap-12 align-items-center">
      <div className="tf-sticky-atc-infos-title text-title">Size:</div>
      <div className="tf-dropdown-sort style-2" data-bs-toggle="dropdown">
        <div className="btn-select">
          <span className="text-sort-value font-2">{selectedSize}</span>
          <span className="icon icon-arrow-down" />
        </div>
        <div className="dropdown-menu">
          {sizes.map((size) => (
            <div
              key={size}
              className={`select-item ${size === selectedSize ? "active" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              <span className="text-value-item">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;
