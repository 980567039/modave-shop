import React, { useState } from "react";

export default function ProductSorting() {
  const [selectedOption, setSelectedOption] = useState("Supper Sale");

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  return (
    <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
      <div className="btn-select">
        <span className="icon icon-tag" />
        <span className="text-sort-value">{selectedOption}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {[
          "Supper Sale",
          "Best selling",
          "Alphabetically, A-Z",
          "Alphabetically, Z-A",
        ].map((option) => (
          <div
            key={option}
            className={`select-item ${
              selectedOption === option ? "active" : ""
            }`}
            onClick={() => handleSelect(option)}
          >
            <span className="text-value-item">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
