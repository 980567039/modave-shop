"use client";
import { useContextElement } from "@/app/newSite-context/Context";
import { allProducts } from "@/app/newSite-data/products";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProductCompare() {
  const {
    compareItem,

    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems([...allProducts.filter((elm) => compareItem.includes(elm.id))]);
  }, [compareItem]);
  return (
    <section className="flat-spacing">
      <div className="container">
        {!items.length ? (
          <div>
            No items to compare yet. Add products to your comparison list and
            decide smarter!{" "}
            <Link className="btn-line" href="/newSite/shop-default-grid">
              Explore Products
            </Link>
          </div>
        ) : (
          ""
        )}
        {items.length ? (
          <div className="tf-compare-table">
            <div className="tf-compare-row tf-compare-grid">
              <div className="tf-compare-col d-md-block d-none" />
              {items.map((elm, i) => (
                <div key={i} className="tf-compare-col">
                  <div className="tf-compare-item">
                    <Link
                      className="tf-compare-image"
                      href={`/product-detail/${elm.id}`}
                    >
                      <Image
                        className="lazyload"
                        alt="img-compare"
                        src={elm.imgSrc}
                        width={600}
                        height={800}
                      />
                    </Link>
                    <div className="tf-compare-content">
                      <Link
                        className="link text-title text-line-clamp-1"
                        href={`/product-detail/${elm.id}`}
                      >
                        {elm.title}
                      </Link>
                      <p className="desc text-caption-1">
                        Clothes, women, T-shirt
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Rating</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field tf-compare-rate"
                >
                  <div className="list-star">
                    <span className="icon icon-star" />
                    <span className="icon icon-star" />
                    <span className="icon icon-star" />
                    <span className="icon icon-star" />
                    <span className="icon icon-star" />
                  </div>
                  <span>(1.234)</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Price</h6>
              </div>

              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field text-center"
                >
                  <span className="price">${elm.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Type</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field text-center"
                >
                  <span className="type">Jacket</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Brand</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field text-center"
                >
                  <span className="brand">Gucci</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>size</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field text-center"
                >
                  <span className="size">X, XS, L, M, XL</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Color</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field text-center"
                >
                  <div className="list-compare-color justify-content-center">
                    <span className="item bg-pink" />
                    <span className="item bg-yellow" />
                    <span className="item bg-primary active" />
                    <span className="item bg-success" />
                    <span className="item bg-warning" />
                  </div>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Metarial</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field text-center"
                >
                  <span className="size">Cotton</span>
                </div>
              ))}
            </div>
            <div className="tf-compare-row">
              <div className="tf-compare-col tf-compare-field d-md-block d-none">
                <h6>Add To Cart</h6>
              </div>
              {items.map((elm, i) => (
                <div
                  key={i}
                  className="tf-compare-col tf-compare-field tf-compare-viewcart text-center"
                >
                  <a
                    className="btn-view-cart"
                    onClick={() => addProductToCart(elm.id)}
                  >
                    {isAddedToCartProducts(elm.id)
                      ? "Already Added"
                      : "Add to Cart"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
