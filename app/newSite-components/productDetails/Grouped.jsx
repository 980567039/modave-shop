"use client";
import { products43 } from "@/app/newSite-data/products";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useContextElement } from "@/app/newSite-context/Context";
export default function Grouped() {
  // State to manage products with their quantities and selection status
  const {
    addProductToCart,
    isAddedToCartProducts,

    updateQuantity,
  } = useContextElement();

  const [products, setProducts] = useState(
    products43.map((product) => ({ ...product, quantity: 1, selected: false })) // Default selected to true
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceOld, setTotalPriceOld] = useState(0);
  // Handler to update the quantity of a specific product
  const handleQuantityChange = (id, change) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(1, product.quantity + change), // Prevent quantity from going below 1
            }
          : product
      )
    );
  };

  // Handler to toggle product selection by checkbox
  const handleCheckboxChange = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  // Calculate the total price of selected products
  useEffect(() => {
    const total = products
      .filter((product) => product.selected) // Only include selected products
      .reduce((total, product) => total + product.price * product.quantity, 0);
    setTotalPrice(total);
  }, [products]);
  useEffect(() => {
    const total = products
      .filter((product) => product.selected && product.oldPrice) // Only include selected products
      .reduce(
        (total, product) => total + product.oldPrice * product.quantity,
        0
      );
    setTotalPriceOld(total);
  }, [products]);

  return (
    <form
      className="form-bundle-product type-product-grouped"
      onSubmit={(e) => e.preventDefault()}
    >
      {products.map((product) => (
        <div className="tf-bundle-product-item" key={product.id}>
          <input
            className="tf-check"
            type="checkbox"
            checked={product.selected}
            onChange={() => handleCheckboxChange(product.id)}
          />
          <div className="tf-product-bundle-image">
            <a href="#">
              <Image
                alt={product.title}
                src={product.imgSrc}
                width={600}
                height={800}
              />
            </a>
          </div>
          <div className="d-flex justify-content-between align-items-center flex-grow-1 gap-12 flex-wrap">
            <div className="tf-product-bundle-infos">
              <div className="text-title">{product.title}</div>
              <div className="tf-product-bundle-variant tf-select">
                <select>
                  {product.variants.map((variant, index) => (
                    <option key={index}>{variant}</option>
                  ))}
                </select>
              </div>
              <div className="tf-product-info-price type-small">
                <h5 className="price-on-sale">${product.price}</h5>
                {product.oldPrice && (
                  <div className="compare-at-price">${product.oldPrice}</div>
                )}
                {product.discount && (
                  <div className="badges-on-sale">{product.discount}</div>
                )}
              </div>
            </div>
            <div className="wg-quantity">
              <span
                className="btn-quantity minus-btn"
                onClick={() => handleQuantityChange(product.id, -1)}
              >
                -
              </span>
              <input
                type="text"
                name="number"
                value={product.quantity}
                readOnly
              />
              <span
                className="btn-quantity plus-btn"
                onClick={() => handleQuantityChange(product.id, 1)}
              >
                +
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="tf-bundle-product-total-submit">
        <h6>Total price:</h6>
        <div className="tf-product-info-price type-1">
          <h4 className="price-on-sale">${totalPrice.toFixed(2)}</h4>
          <div className="compare-at-price">${totalPriceOld.toFixed(2)}</div>
          <div className="badges-on-sale">-20%</div>
        </div>
      </div>
    </form>
  );
}
