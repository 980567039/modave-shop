"use client";
import React, { useEffect, useState } from "react";
import Grid4 from "../grids/Grid4";
import Description from "../descriptions/Description";
import Reviews from "../descriptions/Reviews";
import Shipping from "../descriptions/Shipping";
import ReturnPolicies from "../descriptions/ReturnPolicies";
import SizeSelect from "../SizeSelect";
import ColorSelect from "../ColorSelect";
import QuantitySelect from "../QuantitySelect";
import Image from "next/image";
import { useContextElement } from "@/app/newSite-context/Context";

export default function DetailsFixedprice({ product }) {
  const [activeColor, setActiveColor] = useState("gray");
  const [selectedSize, setSelectedSize] = useState(product.attributes?.[0]?.attributes?.size?.value || "");
  const [filteredColors, setFilteredColors] = useState([]);

  useEffect(() => {
    if (product.attributes && selectedSize) {
      const colors = product.attributes.filter(
        (attr) => attr.attributes.size.value === selectedSize
      );
      setFilteredColors(colors);
    }
  }, [selectedSize, product.attributes]);

  const [quantity, setQuantity] = useState(1);
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    addToCompareItem,
    isAddedtoWishlist,
    isAddedtoCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();
  return (
    <section className="flat-spacing product-fixed-price">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Grid4
              activeColor={activeColor}
              gridImages={product.imageGallery 
                ? product.imageGallery.map(img => ({
                    src: img.url,
                    width: img.width || 1000,
                    height: img.height || 1000,
                    alt: img.alternativeText || product.title,
                    dataPswdWidth: img.width || 1000,
                    dataPswdHeight: img.height || 1000,
                  })) 
                : []
              }
              setActiveColor={setActiveColor}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-7 order-lg-0 order-1">
            <div className="tf-product-info-list left-desc">
              <div className="tf-product-info-choose-option mb_40">
                <div className="tf-product-info-help">
                  <div className="tf-product-info-extra-link">
                    <a
                      href="#delivery_return"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-shipping" />
                      </div>
                      <p className="text-caption-1">Delivery &amp; Return</p>
                    </a>
                    <a
                      href="#ask_question"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-question" />
                      </div>
                      <p className="text-caption-1">Ask a question</p>
                    </a>
                    <a
                      href="#share_social"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-share" />
                      </div>
                      <p className="text-caption-1">Share</p>
                    </a>
                  </div>
                  <div className="tf-product-info-time">
                    <div className="icon">
                      <i className="icon-timer" />
                    </div>
                    <p className="text-caption-1">
                      Estimated Delivery:
                      <span>12-26 days</span> (International),
                      <span>3-6 days</span> (United States)
                    </p>
                  </div>
                  <div className="tf-product-info-return">
                    <div className="icon">
                      <i className="icon-arrowClockwise" />
                    </div>
                    <p className="text-caption-1">
                      Return within <span>45 days</span> of purchase. Duties
                      &amp; taxes are non-refundable.
                    </p>
                  </div>
                  <div className="dropdown dropdown-store-location">
                    <div
                      className="dropdown-title dropdown-backdrop"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                    >
                      <div className="tf-product-info-view link">
                        <div className="icon">
                          <i className="icon-map-pin" />
                        </div>
                        <span>View Store Information</span>
                      </div>
                    </div>
                    <div className="dropdown-menu dropdown-menu-end">
                      <div className="dropdown-content">
                        <div className="dropdown-content-heading">
                          <h5>Store Location</h5>
                          <i className="icon icon-close" />
                        </div>
                        <div className="line-bt" />
                        <div>
                          <h6>Fashion Modave</h6>
                          <p>Pickup available. Usually ready in 24 hours</p>
                        </div>
                        <div>
                          <p>766 Rosalinda Forges Suite 044,</p>
                          <p>Gracielahaven, Oregon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="tf-product-info-sku">
                  <li>
                    <p className="text-caption-1">SKU:</p>
                    <p className="text-caption-1 text-1">53453412</p>
                  </li>
                  <li>
                    <p className="text-caption-1">Vendor:</p>
                    <p className="text-caption-1 text-1">Modave</p>
                  </li>
                  <li>
                    <p className="text-caption-1">Available:</p>
                    <p className="text-caption-1 text-1">Instock</p>
                  </li>
                  <li>
                    <p className="text-caption-1">Categories:</p>
                    <p className="text-caption-1">
                      <a href="#" className="text-1 link">
                        Clothes
                      </a>
                      ,
                      <a href="#" className="text-1 link">
                        women
                      </a>
                      ,
                      <a href="#" className="text-1 link">
                        T-shirt
                      </a>
                    </p>
                  </li>
                </ul>
                <div className="tf-product-info-guranteed">
                  <div className="text-title">Guranteed safe checkout:</div>
                  <div className="tf-payment">
                    <a href="#">
                      <Image
                        alt=""
                        src="/newSite-images/payment/img-1.png"
                        width={100}
                        height={64}
                      />
                    </a>
                    <a href="#">
                      <Image
                        alt=""
                        src="/newSite-images/payment/img-2.png"
                        width={100}
                        height={64}
                      />
                    </a>
                    <a href="#">
                      <Image
                        alt=""
                        src="/newSite-images/payment/img-3.png"
                        width={100}
                        height={64}
                      />
                    </a>
                    <a href="#">
                      <Image
                        alt=""
                        src="/newSite-images/payment/img-4.png"
                        width={98}
                        height={64}
                      />
                    </a>
                    <a href="#">
                      <Image
                        alt=""
                        src="/newSite-images/payment/img-5.png"
                        width={102}
                        height={64}
                      />
                    </a>
                    <a href="#">
                      <Image
                        alt=""
                        src="/newSite-images/payment/img-6.png"
                        width={98}
                        height={64}
                      />
                    </a>
                  </div>
                </div>
              </div>
              <ul className="accordion-product-wrap" id="accordion-product">
                <li className="accordion-product-item">
                  <a
                    href="#accordion-1"
                    className="accordion-title collapsed current"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="accordion-1"
                  >
                    <h6>Description</h6>
                    <span className="btn-open-sub" />
                  </a>
                  <div
                    id="accordion-1"
                    className="collapse"
                    data-bs-parent="#accordion-product"
                  >
                    <div className="accordion-content tab-description">
                      <Description />
                    </div>
                  </div>
                </li>
                <li className="accordion-product-item">
                  <a
                    href="#accordion-2"
                    className="accordion-title current"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="accordion-2"
                  >
                    <h6>Customer Reviews</h6>
                    <span className="btn-open-sub" />
                  </a>
                  <div
                    id="accordion-2"
                    className="collapse show"
                    data-bs-parent="#accordion-product"
                  >
                    <div className="accordion-content tab-reviews write-cancel-review-wrap">
                      <Reviews />
                    </div>
                  </div>
                </li>
                <li className="accordion-product-item">
                  <a
                    href="#accordion-3"
                    className="accordion-title collapsed current"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="accordion-3"
                  >
                    <h6>Shipping &amp; Returns</h6>
                    <span className="btn-open-sub" />
                  </a>
                  <div
                    id="accordion-3"
                    className="collapse"
                    data-bs-parent="#accordion-product"
                  >
                    <div className="accordion-content tab-shipping type-two-cols">
                      <Shipping />
                    </div>
                  </div>
                </li>
                <li className="accordion-product-item">
                  <a
                    href="#accordion-4"
                    className="accordion-title collapsed current"
                    data-bs-toggle="collapse"
                    aria-expanded="true"
                    aria-controls="accordion-4"
                  >
                    <h6>Return Policies</h6>
                    <span className="btn-open-sub" />
                  </a>
                  <div
                    id="accordion-4"
                    className="collapse"
                    data-bs-parent="#accordion-product"
                  >
                    <div className="accordion-content tab-policies">
                      <ReturnPolicies />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="sticky-top">
              <div className="tf-product-info-list right-details">
                <div className="tf-product-info-heading">
                  <div className="tf-product-info-name">
                    <div className="text text-btn-uppercase">Clothing</div>
                    <h3 className="name">{product.title}</h3>
                    {/* <div className="sub">
                      <div className="tf-product-info-rate">
                        <div className="list-star">
                          <i className="icon icon-star" />
                          <i className="icon icon-star" />
                          <i className="icon icon-star" />
                          <i className="icon icon-star" />
                          <i className="icon icon-star" />
                        </div>
                        <div className="text text-caption-1">(134 reviews)</div>
                      </div>
                      <div className="tf-product-info-sold">
                        <i className="icon icon-lightning" />
                        <div className="text text-caption-1">
                          18&nbsp;sold in last&nbsp;32&nbsp;hours
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="tf-product-info-desc">
                    <div className="tf-product-info-price">
                      <h5 className="price-on-sale font-2">
                        {" "}
                        ${product.price.toFixed(2)}
                      </h5>
                      {product.oldPrice ? (
                        <>
                          <div className="compare-at-price font-2">
                            {" "}
                            ${product.oldPrice.toFixed(2)}
                          </div>
                          <div className="badges-on-sale text-btn-uppercase">
                            -25%
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <p>
                     {product.seoDescription}
                    </p>
                    {/* <div className="tf-product-info-liveview">
                      <i className="icon icon-eye" />
                      <p className="text-caption-1">
                        <span className="liveview-count">28</span> people are
                        viewing this right now
                      </p>
                    </div> */}
                  </div>
                </div>
                <div className="tf-product-info-choose-option">
                  <ColorSelect
                    colors={filteredColors}
                    setActiveColor={setActiveColor}
                    activeColor={activeColor}
                  />
                  <SizeSelect 
                    attributes={product.attributes} 
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                  />
                  <div className="tf-product-info-quantity">
                    <div className="title mb_12">Quantity:</div>
                    <QuantitySelect
                      quantity={
                        isAddedToCartProducts(product.id)
                          ? cartProducts.filter(
                              (elm) => elm.id == product.id
                            )[0].quantity
                          : quantity
                      }
                      setQuantity={(qty) => {
                        if (isAddedToCartProducts(product.id)) {
                          updateQuantity(product.id, qty);
                        } else {
                          setQuantity(qty);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <div className="tf-product-info-by-btn mb_10">
                      <a
                        onClick={() => addProductToCart({ ...product, selectedColor: activeColor, selectedSize: selectedSize }, quantity)}
                        className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 btn-add-to-cart"
                      >
                        <span>
                          {isAddedToCartProducts(product.id)
                            ? "Already Added"
                            : "Add to cart -"}
                        </span>
                        <span className="tf-qty-price total-price">
                          $
                          {isAddedToCartProducts(product.id)
                            ? (
                                product.price *
                                cartProducts.filter(
                                  (elm) => elm.id == product.id
                                )[0].quantity
                              ).toFixed(2)
                            : (product.price * quantity).toFixed(2)}{" "}
                        </span>
                      </a>
                      <a
                        href="#compare"
                        data-bs-toggle="offcanvas"
                        aria-controls="compare"
                        onClick={() => addToCompareItem(product.id)}
                        className="box-icon hover-tooltip compare btn-icon-action"
                      >
                        <span className="icon icon-gitDiff" />
                        <span className="tooltip text-caption-2">
                          {isAddedtoCompareItem(product.id)
                            ? "Already compared"
                            : "Compare"}
                        </span>
                      </a>
                      <a
                        onClick={() => addToWishlist(product.id)}
                        className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                      >
                        <span className="icon icon-heart" />
                        <span className="tooltip text-caption-2">
                          {isAddedtoWishlist(product.id)
                            ? "Already Wishlished"
                            : "Wishlist"}
                        </span>
                      </a>
                    </div>
                    <a href="#" className="btn-style-3 text-btn-uppercase">
                      Buy it now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
