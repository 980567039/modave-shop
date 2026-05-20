"use client";

import { useContextElement } from "@/app/newSite-context/Context";
import Image from "next/image";
import React, { useState } from "react";
import QuantitySelect from "./QuantitySelect";
import SizeSelect2 from "./SideSelect2";

function getProductImage(product) {
  return (
    product.defaultImage?.url ||
    product.mainImage ||
    product.image ||
    product.imgSrc ||
    "/newSite-images/products/product-1.jpg"
  );
}

export default function ProductStikyBottom({
  product,
  selectedColor = "",
  selectedSize = "",
}) {
  const {
    addProductToCart,
    isAddedToCartProducts,
    cartProducts,
    updateQuantity,
  } = useContextElement();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const productId = product._id || product.id;
  const productPrice = Number(product.price) || 0;
  const cartItem = cartProducts.find(
    (item) => (item.productId || item._id || item.id) == productId
  );
  const variantText = [selectedColor, selectedSize].filter(Boolean).join(", ");

  return (
    <div className="tf-sticky-btn-atc">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form
              className="form-sticky-atc"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="tf-sticky-atc-product">
                <div className="image">
                  <Image
                    className="lazyload"
                    alt={product.title || ""}
                    src={getProductImage(product)}
                    width={600}
                    height={800}
                  />
                </div>
                <div className="content">
                  <div className="text-title">{product.title}</div>
                  {variantText ? (
                    <div className="text-caption-1 text-secondary-2">
                      {variantText}
                    </div>
                  ) : null}
                  <div className="text-title">${productPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="tf-sticky-atc-infos">
                <SizeSelect2 />
                <div className="tf-sticky-atc-quantity d-flex gap-12 align-items-center">
                  <div className="tf-sticky-atc-infos-title text-title">
                    Quantity:
                  </div>
                  <QuantitySelect
                    styleClass="style-1"
                    quantity={cartItem ? cartItem.quantity : quantity}
                    setQuantity={(qty) => {
                      if (isAddedToCartProducts(productId)) {
                        updateQuantity(productId, qty);
                      } else {
                        setQuantity(qty);
                      }
                    }}
                  />
                </div>
                <div className="tf-sticky-atc-btns">
                  <a
                    onClick={() =>
                      addProductToCart(
                        { ...product, selectedColor, selectedSize },
                        quantity
                      )
                    }
                    className="tf-btn w-100 btn-reset radius-4 btn-add-to-cart"
                  >
                    <span className="text text-btn-uppercase">
                      {isAddedToCartProducts(productId)
                        ? "Already Added"
                        : "Add to cart -"}
                    </span>
                    <span className="tf-qty-price total-price">
                      $
                      {cartItem
                        ? (productPrice * cartItem.quantity).toFixed(2)
                        : (productPrice * quantity).toFixed(2)}
                    </span>
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
