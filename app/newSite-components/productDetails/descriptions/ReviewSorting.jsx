import React, { useState } from "react";

export default function ReviewSorting() {
  const [selectedOption, setSelectedOption] = useState("Most Recent");

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  return (
    <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
      <div className="btn-select">
        <span className="text-sort-value">{selectedOption}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {["Most Recent", "Oldest", "Most Popular"].map((option) => (
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
