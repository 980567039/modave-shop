import React, { useState } from "react";

export default function ProductSearch() {
  const [selectedOption, setSelectedOption] = useState("All");

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="form-search-select">
        <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
          <div className="btn-select">
            <span className="text-sort-value">{selectedOption}</span>
            <span className="icon icon-arrow-down" />
          </div>
          <div className="dropdown-menu">
            {[
              "All",
              "Best selling",
              "Alphabetically, A-Z",
              "Alphabetically, Z-A",
              "Price, low to high",
              "Price, high to low",
              "Date, old to new",
              "Date, new to old",
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
        <input type="text" placeholder="What are you looking for today?" />
        <button className="tf-btn">
          <span className="text">Search</span>
        </button>
      </div>
    </form>
  );
}
