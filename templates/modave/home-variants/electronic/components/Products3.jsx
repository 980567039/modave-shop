"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useContextElement } from "@/app/newSite-context/Context";
export default function Products3({ featuredProducts = [], newArrivals = [], maybeYouLike = [] }) {
  const { addProductToCart } = useContextElement();
  return (
    <section className="flat-spacing-4">
      <div className="container">
        <div className="grid-card-product tf-grid-layout lg-col-3 md-col-2">
          <div className="column-card-product">
            <h5 className="heading wow fadeInUp">Featured products</h5>
            <div className="list-card-product">
              {featuredProducts.map((product, index) => (
                <div
                  key={index}
                  className="card-product list-st-2 wow fadeInUp"
                >
                  <div className="card-product-wrapper">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="product-img"
                    >
                      <Image
                        className="lazyload img-product"
                        data-src={product.imgSrc}
                        alt="image-product"
                        src={product.imgSrc}
                        width={600}
                        height={800}
                      />
                      <Image
                        className="lazyload img-hover"
                        data-src={product.imgHoverSrc}
                        alt="image-product"
                        src={product.imgHoverSrc}
                        width={600}
                        height={800}
                      />
                    </Link>
                    <div className="on-sale-wrap">
                      <span className="on-sale-item">
                        {product.salePercentage}
                      </span>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="title link"
                    >
                      {product.title}
                    </Link>
                    <div className="bottom">
                      <div className="inner-left">
                        <div className="box-rating">
                          <ul className="list-star">
                            {[...Array(product.rating)].map((_, starIndex) => (
                              <li key={starIndex} className="icon icon-star" />
                            ))}
                          </ul>
                          <span className="text-caption-1 text-secondary">
                            ({product.reviews})
                          </span>
                        </div>
                        <span className="price py-4">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <a
                        onClick={() => addProductToCart(product.id)}
                        className="box-icon"
                      >
                        <svg
                          width={25}
                          height={24}
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.2187 10.3327V5.99935C16.2187 4.85008 15.7622 3.74788 14.9495 2.93522C14.1369 2.12256 13.0347 1.66602 11.8854 1.66602C10.7361 1.66602 9.63394 2.12256 8.82129 2.93522C8.00863 3.74788 7.55208 4.85008 7.55208 5.99935V10.3327M4.30208 8.16602H19.4687L20.5521 21.166H3.21875L4.30208 8.16602Z"
                            stroke="#181818"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="column-card-product">
            <h5 className="heading wow fadeInUp">New Arrivals</h5>
            <div className="list-card-product">
              {newArrivals.map((product, index) => (
                <div
                  key={index}
                  className="card-product list-st-2 wow fadeInUp"
                >
                  <div className="card-product-wrapper">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="product-img"
                    >
                      <Image
                        className="lazyload img-product"
                        data-src={product.imgSrc}
                        alt="image-product"
                        src={product.imgSrc}
                        width={600}
                        height={800}
                      />
                      <Image
                        className="lazyload img-hover"
                        data-src={product.imgHoverSrc}
                        alt="image-product"
                        src={product.imgHoverSrc}
                        width={600}
                        height={800}
                      />
                    </Link>
                    <div className="on-sale-wrap">
                      <span className="on-sale-item">
                        {product.salePercentage}
                      </span>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="title link"
                    >
                      {product.title}
                    </Link>
                    <div className="bottom">
                      <div className="inner-left">
                        <div className="box-rating">
                          <ul className="list-star">
                            {[...Array(product.rating)].map((_, starIndex) => (
                              <li key={starIndex} className="icon icon-star" />
                            ))}
                          </ul>
                          <span className="text-caption-1 text-secondary">
                            ({product.reviews})
                          </span>
                        </div>
                        <span className="price py-4">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <a
                        onClick={() => addProductToCart(product.id)}
                        className="box-icon"
                      >
                        <svg
                          width={25}
                          height={24}
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.2187 10.3327V5.99935C16.2187 4.85008 15.7622 3.74788 14.9495 2.93522C14.1369 2.12256 13.0347 1.66602 11.8854 1.66602C10.7361 1.66602 9.63394 2.12256 8.82129 2.93522C8.00863 3.74788 7.55208 4.85008 7.55208 5.99935V10.3327M4.30208 8.16602H19.4687L20.5521 21.166H3.21875L4.30208 8.16602Z"
                            stroke="#181818"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="column-card-product">
            <h5 className="heading wow fadeInUp">Maybe you will love</h5>
            <div className="list-card-product">
              {maybeYouLike.map((product, index) => (
                <div
                  key={index}
                  className="card-product list-st-2 wow fadeInUp"
                >
                  <div className="card-product-wrapper">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="product-img"
                    >
                      <Image
                        className="lazyload img-product"
                        data-src={product.imgSrc}
                        alt="image-product"
                        src={product.imgSrc}
                        width={600}
                        height={800}
                      />
                      <Image
                        className="lazyload img-hover"
                        data-src={product.imgHoverSrc}
                        alt="image-product"
                        src={product.imgHoverSrc}
                        width={600}
                        height={800}
                      />
                    </Link>
                    <div className="on-sale-wrap">
                      <span className="on-sale-item">
                        {product.salePercentage}
                      </span>
                    </div>
                  </div>
                  <div className="card-product-info">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="title link"
                    >
                      {product.title}
                    </Link>
                    <div className="bottom">
                      <div className="inner-left">
                        <div className="box-rating">
                          <ul className="list-star">
                            {[...Array(product.rating)].map((_, starIndex) => (
                              <li key={starIndex} className="icon icon-star" />
                            ))}
                          </ul>
                          <span className="text-caption-1 text-secondary">
                            ({product.reviews})
                          </span>
                        </div>
                        <span className="price py-4">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <a
                        onClick={() => addProductToCart(product.id)}
                        className="box-icon"
                      >
                        <svg
                          width={25}
                          height={24}
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.2187 10.3327V5.99935C16.2187 4.85008 15.7622 3.74788 14.9495 2.93522C14.1369 2.12256 13.0347 1.66602 11.8854 1.66602C10.7361 1.66602 9.63394 2.12256 8.82129 2.93522C8.00863 3.74788 7.55208 4.85008 7.55208 5.99935V10.3327M4.30208 8.16602H19.4687L20.5521 21.166H3.21875L4.30208 8.16602Z"
                            stroke="#181818"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
