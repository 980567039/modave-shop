"use client";


import { productMain } from "@/app/newSite-data/products";

import RangeSlider from "react-range-slider-input";
import React, { useState, useEffect } from "react";

export default function FilterModal({ allProps }) {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, metaRes] = await Promise.all([
           fetch("/api/site/categories"),
           fetch("/api/site/product/meta")
        ]);

        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.data || []);
        }

        if (metaRes.ok) {
            const data = await metaRes.json();
            const colorAttr = data.data.attributes.find(attr => attr.name === 'color');
            if (colorAttr) {
                setColors(colorAttr.terms || []);
            }
            const sizeAttr = data.data.attributes.find(attr => attr.name === 'size');
            if (sizeAttr) {
                setSizes(sizeAttr.terms || []);
            }
        }
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <h5>Filters</h5>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body">
          <div className="widget-facet facet-categories">
            <h6 className="facet-title">Product Categories</h6>
            <ul className="facet-content">
              {categories.map((category, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`categories-item ${allProps.category === category.slug ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      allProps.setCategory(category.slug);
                    }}
                  >
                    {category.title}{" "}
                    <span className="count-cate">({category.productCount || 0})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="widget-facet facet-price">
            <h6 className="facet-title">Price</h6>

            <RangeSlider
              min={10}
              max={5000}
              value={allProps.price}
              onInput={(value) => allProps.setPrice(value)}
            />
            <div className="box-price-product mt-3">
              <div className="box-price-item">
                <span className="title-price">Min price</span>
                <div
                  className="price-val"
                  id="price-min-value"
                  data-currency="$"
                >
                  {allProps.price[0]}
                </div>
              </div>
              <div className="box-price-item">
                <span className="title-price">Max price</span>
                <div
                  className="price-val"
                  id="price-max-value"
                  data-currency="$"
                >
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
                  onClick={() => allProps.setSize(size.termName)}
                  className={`size-item size-check ${
                    allProps.size === size.termName ? "active" : ""
                  }`}
                  style={{ width: "auto", padding: "0 10px" }}
                >
                  {size.termName}
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
                    color.termName == allProps.color?.termName ? "active" : ""
                  }`}
                >
                  <span className="color" style={{ backgroundColor: color.termName }} />
                  {color.termName}
                </div>
              ))}
            </div>
          </div>
          {/* <div className="widget-facet facet-fieldset">
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
          </div> */}
          {/* <div className="widget-facet facet-fieldset">
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
                      (
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
          </div> */}
        </div>
        <div className="canvas-bottom">
          <button
            id="reset-filter"
            onClick={allProps.clearFilter}
            className="tf-btn btn-reset"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
