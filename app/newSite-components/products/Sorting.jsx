"use client";
const filterOptions = [
  "Sort by (Default)",
  "Title Ascending",
  "Title Descending",
  "Price Ascending",
  "Price Descending",
];
export default function Sorting({ allProps }) {
  return (
    <div className="tf-dropdown-sort" data-bs-toggle="dropdown">
      <div className="btn-select">
        <span className="text-sort-value">{allProps.sortingOption}</span>
        <span className="icon icon-arrow-down" />
      </div>
      <div className="dropdown-menu">
        {filterOptions.map((option, i) => (
          <div
            onClick={() => allProps.setSortingOption(option)}
            key={i}
            className={`select-item ${
              allProps.sortingOption == option ? "active" : ""
            }`}
          >
            <span className="text-value-item">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
