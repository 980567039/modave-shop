import React from "react";

export default function FilterMeta({ allProps, productLength }) {
  return (
    <div className="meta-filter-shop" style={{}}>
      <div id="product-count-grid" className="count-text">
        <span className="count">{productLength}</span> Products Found
      </div>

      <div id="applied-filters">
        {allProps.availability != "All" ? (
          <span
            className="filter-tag"
            onClick={() => allProps.setAvailability("All")}
          >
            {allProps.availability.label}
            <span className="remove-tag icon-close" />
          </span>
        ) : (
          ""
        )}
        {allProps.size != "All" ? (
          <span className="filter-tag" onClick={() => allProps.setSize("All")}>
            {allProps.size}
            <span className="remove-tag icon-close" />
          </span>
        ) : (
          ""
        )}
        {allProps.color != "All" ? (
          <span
            className="filter-tag color-tag"
            onClick={() => allProps.setColor("All")}
          >
            <span className="color" style={{ backgroundColor: allProps.color.color }} />
            {allProps.color.termName || allProps.color.name || allProps.color}
            <span className="remove-tag icon-close" />
          </span>
        ) : (
          ""
        )}

        {allProps.brands.length ? (
          <React.Fragment>
            {allProps.brands.map((brand, i) => (
              <span
                key={i}
                className="filter-tag"
                onClick={() => allProps.removeBrand(brand)}
              >
                {brand}
                <span className="remove-tag icon-close" />
              </span>
            ))}
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
      {allProps.availability != "All" ||
      allProps.size != "All" ||
      allProps.color != "All" ||
      allProps.brands.length ? (
        <button
          id="remove-all"
          className="remove-all-filters text-btn-uppercase"
          onClick={allProps.clearFilter}
        >
          REMOVE ALL <i className="icon icon-close" />
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
