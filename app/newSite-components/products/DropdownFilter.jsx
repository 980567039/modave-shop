"use client";

import {
  availabilityOptions,
  brands,
  categories,
  colors,
  sizes,
} from "@/app/newSite-data/productFilterOptions";
import { productMain } from "@/app/newSite-data/products";

import RangeSlider from "react-range-slider-input";

export default function DropdownFilter({ allProps, setIsDDActive }) {
  return (
    <div className="canvas-wrapper">
      <div className="canvas-header d-flex d-xl-none">
        <h5>Filters</h5>
        <span
          className="icon-close close-filter"
          onClick={() => setIsDDActive(false)}
        />
      </div>
      <div className="canvas-body">
        <div className="widget-facet facet-categories">
          <h6 className="facet-title">Product Categories</h6>
          <ul className="facet-content">
            {categories.map((category, index) => (
              <li key={index}>
                <a href="#" className={`categories-item`}>
                  {category.name}{" "}
                  <span className="count-cate">({category.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="widget-facet facet-price">
          <h6 className="facet-title">Price</h6>

          <RangeSlider
            min={10}
            max={450}
            value={allProps.price}
            onInput={(value) => allProps.setPrice(value)}
          />
          <div className="box-price-product mt-3">
            <div className="box-price-item">
              <span className="title-price">Min price</span>
              <div className="price-val" id="price-min-value" data-currency="$">
                {allProps.price[0]}
              </div>
            </div>
            <div className="box-price-item">
              <span className="title-price">Max price</span>
              <div className="price-val" id="price-max-value" data-currency="$">
                {allProps.price[1]}
              </div>
            </div>
          </div>
        </div>
        <div className="widget-facet facet-size">
          <h6 className="facet-title">Size</h6>
          <div className="facet-size-box size-box">
            {sizes.map((size, index) => (
              <span
                key={index}
                onClick={() => allProps.setSize(size)}
                className={`size-item size-check ${
                  allProps.size === size ? "active" : ""
                }`}
              >
                {size}
              </span>
            ))}
            <span
              className={`size-item size-check free-size ${
                allProps.size == "Free Size" ? "active" : ""
              } `}
              onClick={() => allProps.setSize("Free Size")}
            >
              Free Size
            </span>
          </div>
        </div>
        <div className="widget-facet facet-color">
          <h6 className="facet-title">Colors</h6>
          <div className="facet-color-box">
            {colors.map((color, index) => (
              <div
                onClick={() => allProps.setColor(color)}
                key={index}
                className={`color-item color-check ${
                  color == allProps.color ? "active" : ""
                }`}
              >
                <span className={`color ${color.className}`} />
                {color.name}
              </div>
            ))}
          </div>
        </div>
        <div className="widget-facet facet-fieldset">
          <h6 className="facet-title">Availability</h6>
          <div className="box-fieldset-item">
            {availabilityOptions.map((option, index) => (
              <fieldset
                key={index}
                className="fieldset-item"
                onClick={() => allProps.setAvailability(option)}
              >
                <input
                  type="radio"
                  name="availability"
                  className="tf-check"
                  readOnly
                  checked={allProps.availability === option}
                />
                <label>
                  {option.label}{" "}
                  <span className="count-stock">
                    (
                    {
                      productMain.filter((el) => el.inStock == option.value)
                        .length
                    }
                    )
                  </span>
                </label>
              </fieldset>
            ))}
          </div>
        </div>
        <div className="widget-facet facet-fieldset">
          <h6 className="facet-title">Brands</h6>
          <div className="box-fieldset-item">
            {brands.map((brand, index) => (
              <fieldset
                key={index}
                className="fieldset-item"
                onClick={() => allProps.setBrands(brand.label)}
              >
                <input
                  type="checkbox"
                  name="brand"
                  className="tf-check"
                  readOnly
                  checked={allProps.brands.includes(brand.label)}
                />
                <label>
                  {brand.label}{" "}
                  <span className="count-brand">
                    ({" "}
                    {
                      productMain.filter((el) =>
                        el.filterBrands.includes(brand.label)
                      ).length
                    }
                    )
                  </span>
                </label>
              </fieldset>
            ))}
          </div>
        </div>
      </div>
      <div className="canvas-bottom d-block d-xl-none">
        <button
          id="reset-filter"
          onClick={allProps.clearFilter}
          className="tf-btn btn-reset"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
