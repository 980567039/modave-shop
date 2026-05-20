"use client";
import React, { useState } from "react";
import QuantitySelect from "./QuantitySelect";
import { useContextElement } from "@/app/newSite-context/Context";
import { products41 } from "@/app/newSite-data/products";

export default function SubscribeAndSave() {
  const {
    isAddedToCartProducts,

    cartProducts,
    updateQuantity,
  } = useContextElement();
  const [quantity, setQuantity] = useState(1); // Initial quantity is 1
  return (
    <div className="tf-product-subscribe-save">
      <h6 className="mb_12">Subscribe and Save!</h6>
      <div className="tf-product-subscribe">
        <div className="tf-product-subscribe-item">
          <label htmlFor="one-time" className="text-secondary">
            One-time purchase
          </label>
          <input
            className=""
            type="radio"
            id="one-time"
            name="subscribe-save"
          />
        </div>
        <div className="tf-product-subscribe-item">
          <label htmlFor="subscribe-save" className="">
            Subscribe &amp;
            <span className="text-button text-primary">Save 10%</span>
            ($31.47)
          </label>
          <input
            className=""
            type="radio"
            id="subscribe-save"
            name="subscribe-save"
            defaultChecked
          />
          <div className="tf-product-box-save">
            <div className="variant-picker-item mb_20">
              <div className="variant-picker-label mb_12">
                Delivers every:
                <span className="text-title variant-picker-label-value">
                  30 Days
                </span>
              </div>
              <div className="variant-picker-values type-click">
                <input
                  type="radio"
                  name="day"
                  id="values-30-day"
                  defaultChecked
                />
                <label
                  className="style-text-1"
                  htmlFor="values-30-day"
                  data-value="30 Days"
                >
                  <span className="text-title">30 Days</span>
                </label>
                <input type="radio" name="day" id="values-60-day" />
                <label
                  className="style-text-1"
                  htmlFor="values-60-day"
                  data-value="60 Days"
                >
                  <span className="text-title">60 Days</span>
                </label>
                <input type="radio" name="day" id="values-90-day" />
                <label
                  className="style-text-1"
                  htmlFor="values-90-day"
                  data-value="90 Days"
                >
                  <span className="text-title">90 Days</span>
                </label>
              </div>
            </div>
            <div className="variant-picker-item mb_20">
              <div className="variant-picker-label mb_12">
                Size:
                <span className="text-title variant-picker-label-value">
                  30ML
                </span>
              </div>
              <div className="variant-picker-values type-click">
                <input
                  type="radio"
                  name="ml"
                  id="values-30-ml"
                  defaultChecked
                />
                <label
                  className="style-text-1"
                  htmlFor="values-30-ml"
                  data-value="30ML"
                >
                  <span className="text-title">30ML</span>
                </label>
                <input type="radio" name="ml" id="values-60-ml" />
                <label
                  className="style-text-1"
                  htmlFor="values-60-ml"
                  data-value="60ML"
                >
                  <span className="text-title">60ML</span>
                </label>
                <input type="radio" name="ml" id="values-90-ml" />
                <label
                  className="style-text-1"
                  htmlFor="values-90-ml"
                  data-value="90ML"
                >
                  <span className="text-title">90ML</span>
                </label>
              </div>
            </div>
            <div className="tf-product-info-quantity">
              <div className="title mb_12">Quantity:</div>
              <QuantitySelect
                styleClass="style-1"
                quantity={
                  isAddedToCartProducts(products41[2].id)
                    ? cartProducts.filter(
                        (elm) => elm.id == products41[2].id
                      )[0].quantity
                    : quantity
                }
                setQuantity={(qty) => {
                  if (isAddedToCartProducts(products41[2].id)) {
                    updateQuantity(products41[2].id, qty);
                  } else {
                    setQuantity(qty);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
