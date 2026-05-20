"use client";
import React, { useState } from "react";
import Image from "next/image";

const materials = [
  {
    id: "values-fabric",
    label: "Fabric",
    imgSrc: "/newSite-images/products/item/material-1.jpg",
    alt: "Fabric",
    value: "fabric",
  },
  {
    id: "values-chenille",
    label: "Chenille",
    imgSrc: "/newSite-images/products/item/material-2.jpg",
    alt: "Chenille",
    value: "chenille",
  },
  {
    id: "values-silk",
    label: "Silk",
    imgSrc: "/newSite-images/products/item/material-3.jpg",
    alt: "Silk",
    value: "silk",
  },
];

const SelectMaterial = () => {
  const [activeVariant, setActiveVariant] = useState("silk"); // Initial active variant is 'silk'

  const handleVariantChange = (value) => {
    setActiveVariant(value);
  };

  return (
    <div className="variant-picker-item">
      <div className="variant-picker-label mb_12">
        Material:
        <span className="text-title variant-picker-label-value value-currentVariant">
          {
            materials.find((material) => material.value === activeVariant)
              ?.label
          }
        </span>
      </div>
      <div className="variant-picker-values">
        {materials.map((material) => (
          <div key={material.id}>
            <input
              id={material.id}
              type="radio"
              name="material"
              checked={activeVariant === material.value}
              onChange={() => handleVariantChange(material.value)}
            />
            <label
              className={`style-image hover-tooltip tooltip-bot other-variant-btn ${
                activeVariant === material.value ? "active" : ""
              }`}
              data-other-variant={material.value}
              htmlFor={material.id}
              data-value={material.label}
            >
              <Image
                className="lazyloaded"
                data-src={material.imgSrc}
                src={material.imgSrc}
                alt={material.alt}
                width={120}
                height={160}
              />
              <span className="tooltip">{material.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectMaterial;
