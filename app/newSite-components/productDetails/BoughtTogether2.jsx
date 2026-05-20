"use client";
import { products43 } from "@/app/newSite-data/products";
import React, { useState } from "react";
import Image from "next/image";
import { useContextElement } from "@/app/newSite-context/Context";
const BoughtTogether2 = () => {
  const {
    addProductToCart,
    isAddedToCartProducts,

    updateQuantity,
  } = useContextElement();
  const [products, setProducts] = useState([
    ...products43.map((el) => ({ ...el, checked: false })),
  ]);

  const handleCheckboxChange = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      )
    );
  };

  const handleVariantChange = (id, selectedVariant) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, selectedVariant } : product
      )
    );
  };

  const selectedProducts = products.filter((product) => product.checked);
  const totalPrice = selectedProducts.reduce(
    (total, product) => total + product.price,
    0
  );
  const totaloldPrice = selectedProducts.reduce(
    (total, product) => total + (product.oldPrice || 0),
    0
  );

  return (
    <form
      className="form-bundle-product type-cols"
      onSubmit={(e) => e.preventDefault()}
    >
      <h5 className="mb_16">Frequently bought together</h5>
      <div className="tf-bundle-products-wrap">
        {products.map((product) => (
          <div key={product.id} className="tf-bundle-product-item">
            <input
              className="tf-check"
              type="checkbox"
              checked={product.checked}
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
            <div className="tf-product-bundle-infos">
              <div className="text-title">{product.title}</div>
              <div className="tf-product-bundle-variant tf-select">
                <select
                  value={product.selectedVariant}
                  onChange={(e) =>
                    handleVariantChange(product.id, e.target.value)
                  }
                >
                  {product.variants.map((variant, index) => (
                    <option key={index} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tf-product-info-price type-small">
                <h5 className="price-on-sale">${product.price.toFixed(2)}</h5>
                {product.oldPrice && (
                  <div className="compare-at-price">
                    ${product.oldPrice.toFixed(2)}
                  </div>
                )}
                {product.discount && (
                  <div className="badges-on-sale">{product.discount}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tf-bundle-product-total-submit">
        <h6>Total price:</h6>
        <div className="tf-product-info-price type-1">
          <h4 className="price-on-sale">${totalPrice.toFixed(2)}</h4>
          {totaloldPrice > 0 && (
            <div className="compare-at-price">${totaloldPrice.toFixed(2)}</div>
          )}
          {totaloldPrice > totalPrice && (
            <div className="badges-on-sale">
              -
              {Math.round(((totaloldPrice - totalPrice) / totaloldPrice) * 100)}
              %
            </div>
          )}
        </div>
      </div>
      <a
        onClick={() =>
          products
            .filter((el) => el.checked)
            .forEach((el) => addProductToCart(el))
        }
        className="tf-bundle-product-btn btn-style-2 text-btn-uppercase"
      >
        {products
          .filter((el) => el.checked)
          .every((el) => isAddedToCartProducts(el.id)) &&
        products.filter((el) => el.checked).length
          ? "Selected already in cart"
          : "Add selected to cart"}
      </a>
    </form>
  );
};

export default BoughtTogether2;
