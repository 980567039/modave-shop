"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/app/newSite-context/Context";
export default function ProductCard2({
  product,
  addedClass = "",
}) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  return (
    <div
      className={`card-product bundle-hover-item  ${addedClass} wow fadeInUp`}
      data-wow-delay={product.wowDelay}
    >
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={product.imgSrc}
            src={currentImage}
            alt="image-product"
            width={351}
            height={468}
          />
          <Image
            className="lazyload img-hover"
            data-src={product.imgHover}
            src={product.imgHover}
            alt="image-product"
            width={600}
            height={800}
          />
        </Link>
        <div className="on-sale-wrap">
          <span className="on-sale-item">{product.saleText}</span>
        </div>
        <div className="list-btn-main">
          <a
            href="#quickView"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="btn-main-product"
          >
            Quick View
          </a>
        </div>
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">
          <span className="old-price">${product.price.toFixed(2)}</span>$
          {product.oldPrice.toFixed(2)}
        </span>
        <ul className="list-color-product">
          {product.colors.map((color, idx) => (
            <li
              className={`list-color-item color-swatch ${
                currentImage == color.imgSrc ? "active" : ""
              }  ${color.bgColor == "bg-white" ? "line" : ""}`}
              onMouseOver={() => setCurrentImage(color.imgSrc)}
              key={idx}
            >
              <span className={`swatch-value ${color.bgColor}`} />
              <Image
                className="lazyload"
                data-src={color.imgSrc}
                src={color.imgSrc}
                alt="image-product"
                width={600}
                height={800}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
