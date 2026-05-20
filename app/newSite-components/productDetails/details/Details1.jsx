"use client";
import React, { useEffect, useState } from "react";
import Slider1 from "../sliders/Slider1";
import ColorSelect from "../ColorSelect";
import SizeSelect from "../SizeSelect";
import QuantitySelect from "../QuantitySelect";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/app/newSite-context/Context";
import ProductStikyBottom from "../ProductStikyBottom";
export default function Details1({ product }) {
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
    isAddedtoWishlist,
    isAddedtoCompareItem,
    addToCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();
  const productId = product._id || product.id;
  const productPrice = Number(product.price) || 0;
  const productOldPrice = Number(product.oldPrice || product.salePrice) || 0;
  const categoryTitle =
    product.category?.[0]?.customCategoryTitle || product.category?.[0]?.title;
  const cartItem = cartProducts.find(
    (item) => (item.productId || item._id || item.id) == productId
  );
  const availability =
    Number(product.availableStock || product.stock || 0) > 0
      ? "In stock"
      : "Out of stock";

  return (
    <section className="flat-spacing">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Product default */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <Slider1
                  setActiveColor={setActiveColor}
                  activeColor={activeColor}
                  sliderItems={product.imageGallery}
                  firstItem={product.defaultImage?.url}
                />
              </div>
            </div>
            {/* /Product default */}
            {/* tf-product-info-list */}
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative mw-100p-hidden ">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-heading">
                    <div className="tf-product-info-name">
                      {categoryTitle ? (
                        <div className="text text-btn-uppercase">{categoryTitle}</div>
                      ) : null}
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
                          <div className="text text-caption-1">
                            (134 reviews)
                          </div>
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
                          ${productPrice.toFixed(2)}
                        </h5>
                        {productOldPrice ? (
                          <>
                            <div className="compare-at-price font-2">
                              {" "}
                              ${productOldPrice.toFixed(2)}
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
                          cartItem
                            ? cartItem.quantity
                            : quantity
                        }
                        setQuantity={(qty) => {
                          if (isAddedToCartProducts(productId)) {
                            updateQuantity(productId, qty);
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
                            {isAddedToCartProducts(productId)
                              ? "Already Added"
                              : "Add to cart -"}
                          </span>
                          <span className="tf-qty-price total-price">
                            $
                            {cartItem
                              ? (productPrice * cartItem.quantity).toFixed(2)
                              : (productPrice * quantity).toFixed(2)}{" "}
                          </span>
                        </a>
                        <a
                          href="#compare"
                          data-bs-toggle="offcanvas"
                          aria-controls="compare"
                          onClick={() => addToCompareItem(product)}
                          className="box-icon hover-tooltip compare btn-icon-action"
                        >
                          <span className="icon icon-gitDiff" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoCompareItem(productId)
                              ? "Already compared"
                              : "Compare"}
                          </span>
                        </a>
                        <a
                          onClick={() => addToWishlist(product)}
                          className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                        >
                          <span className="icon icon-heart" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoWishlist(productId)
                              ? "Already Wishlished"
                              : "Wishlist"}
                          </span>
                        </a>
                      </div>
                      <a href="#" className="btn-style-3 text-btn-uppercase">
                        Buy it now
                      </a>
                    </div>
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
                          <p className="text-caption-1">
                            Delivery &amp; Return
                          </p>
                        </a>
                        <a
                          href="#ask_question"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-question" />
                          </div>
                          <p className="text-caption-1">Ask A Question</p>
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
                          Estimated Delivery:&nbsp;&nbsp;<span>12-26 days</span>
                          (International), <span>3-6 days</span> (United States)
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
                    </div>
                    <ul className="tf-product-info-sku">
                      <li>
                        <p className="text-caption-1">SKU:</p>
                        <p className="text-caption-1 text-1">
                          {product.sku || productId}
                        </p>
                      </li>
                      <li>
                        <p className="text-caption-1">Vendor:</p>
                        <p className="text-caption-1 text-1">
                          {product.brand?.title || product.vendor || "Store"}
                        </p>
                      </li>
                      <li>
                        <p className="text-caption-1">Available:</p>
                        <p className="text-caption-1 text-1">{availability}</p>
                      </li>
                      {product.category?.length ? (
                        <li>
                          <p className="text-caption-1">Categories:</p>
                          <p className="text-caption-1">
                            {product.category.map((category, index) => (
                              <React.Fragment key={category._id || category.slug || index}>
                                {index > 0 ? ", " : ""}
                                <Link
                                  href={
                                    category.slug
                                      ? `/shop-default-grid?category=${encodeURIComponent(category.slug)}`
                                      : "/shop-default-grid"
                                  }
                                  className="text-1 link"
                                >
                                  {category.customCategoryTitle || category.title}
                                </Link>
                              </React.Fragment>
                            ))}
                          </p>
                        </li>
                      ) : null}
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
                </div>
              </div>
            </div>
            {/* /tf-product-info-list */}
          </div>
        </div>
      </div>
      <ProductStikyBottom product={product} selectedColor={activeColor} selectedSize={selectedSize} />
    </section>
  );
}
