"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useContextElement } from "@/app/newSite-context/Context";
export default function LookbookProduct({ product, styleClass = "style-row" }) {
  const { setQuickViewItem } = useContextElement();
  const safeProduct = product || {
    id: "fallback",
    title: "Featured product",
    price: 0,
    imgSrc: "/newSite-images/products/womens/women-19.jpg",
  };
  const productImage = safeProduct.imgSrc || safeProduct.image || safeProduct.mainImage || "/newSite-images/products/womens/women-19.jpg";
  const productTitle = safeProduct.title || safeProduct.name || "Featured product";
  const productPrice = Number(safeProduct.price) || 0;

  return (
    <div className={`loobook-product ${styleClass} `}>
      <div className="img-style">
        <Image alt={productTitle} src={productImage} width={151} height={151} />
      </div>
      <div className="content">
        <div className="info">
          <Link
            href={`/product-detail/${safeProduct.id || safeProduct._id}`}
            className="text-title text-line-clamp-1 link"
          >
            {productTitle}
          </Link>
          <div className="price text-button">${productPrice.toFixed(2)}</div>
        </div>
        <a
          href="#quickView"
          onClick={() => setQuickViewItem(safeProduct)}
          data-bs-toggle="modal"
          className="btn-lookbook btn-line"
        >
          Quick View
        </a>
      </div>
    </div>
  );
}
