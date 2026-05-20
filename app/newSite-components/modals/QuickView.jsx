"use client";
import React, { useState } from "react";
import Image from "next/image";
import SizeSelect from "../productDetails/SizeSelect";
import ColorSelect from "../productDetails/ColorSelect";
import Grid5 from "../productDetails/grids/Grid5";
import { useContextElement } from "@/app/newSite-context/Context";
import QuantitySelect from "../productDetails/QuantitySelect";
export default function QuickView() {
  const [activeColor, setActiveColor] = useState("gray");
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1); // Initial quantity is 1
  const {
    quickViewItem,
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();
  console.log(quickViewItem)
  const openModalSizeChoice = () => {
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    var myModal = new bootstrap.Modal(document.getElementById("size-guide"), {
      keyboard: false,
    });

    myModal.show();
    document
      .getElementById("size-guide")
      .addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });
    const backdrops = document.querySelectorAll(".modal-backdrop");
    if (backdrops.length > 1) {
      // Apply z-index to the last backdrop
      const lastBackdrop = backdrops[backdrops.length - 1];
      lastBackdrop.style.zIndex = "1057";
    }
  };
  return (
    <div className="modal fullRight fade modal-quick-view" id="quickView">
      <div className="modal-dialog">
        <div className="modal-content">
          {quickViewItem && (
            <>
              <Grid5
                firstItem={quickViewItem.imgSrc}
                activeColor={activeColor}
                setActiveColor={setActiveColor}
                images={
                  quickViewItem.imageGallery?.length ? 
                  quickViewItem.imageGallery.map((img, index) => ({
                    src: img.url,
                    dataScroll: "gray" // Default or map if possible
                  })) : 
                  [{ src: quickViewItem.imgSrc, dataScroll: "gray" }]
                }
              />
              <div className="wrap mw-100p-hidden">
                <div className="header">
                  <h5 className="title">Quick View</h5>
                  <span
                    className="icon-close icon-close-popup"
                    data-bs-dismiss="modal"
                  />
                </div>
                <div className="tf-product-info-list">
                  <div className="tf-product-info-heading">
                    <div className="tf-product-info-name">
                      <div className="text text-btn-uppercase">Clothing</div>
                      <h3 className="name">{quickViewItem.title}</h3>
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
                          ${quickViewItem.price.toFixed(2)}
                        </h5>
                        {quickViewItem.oldPrice ? (
                          <>
                            <div className="compare-at-price font-2">
                              {" "}
                              ${quickViewItem.oldPrice.toFixed(2)}
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
                        The garments labelled as Committed are products that have
                        been produced using sustainable fibres or processes,
                        reducing their environmental impact.
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
                      activeColor={activeColor}
                      setActiveColor={setActiveColor}
                      colorOptions={
                        quickViewItem.attributes?.find(
                          (attr) => attr.name === "Color"
                        )?.values.map((v) => ({
                          id: v.value,
                          value: v.value,
                          color: v.value.toLowerCase(), // Ensure lowercase for CSS class
                        })) || []
                      }
                    />
                    <SizeSelect 
                      attributes={quickViewItem.attributes}
                      selectedSize={selectedSize}
                      setSelectedSize={setSelectedSize}
                    />
                    <div className="tf-product-info-quantity">
                      <div className="title mb_12">Quantity:</div>
                      <QuantitySelect
                        quantity={
                          isAddedToCartProducts(quickViewItem.id)
                            ? cartProducts.filter(
                                (elm) => elm.id == quickViewItem.id
                              )[0].quantity
                            : quantity
                        }
                        setQuantity={(qty) => {
                          if (isAddedToCartProducts(quickViewItem.id)) {
                            updateQuantity(quickViewItem.id, qty);
                          } else {
                            setQuantity(qty);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <div className="tf-product-info-by-btn mb_10">
                        <a
                          className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 show-shopping-cart"
                          onClick={() =>
                            addProductToCart({ ...quickViewItem, selectedColor: activeColor, selectedSize: selectedSize }, quantity)
                          }
                        >
                          <span>
                            {isAddedToCartProducts(quickViewItem.id)
                              ? "Already Added"
                              : "Add to cart -"}
                          </span>
                          <span className="tf-qty-price total-price">
                            $
                            {isAddedToCartProducts(quickViewItem.id)
                              ? (
                                  quickViewItem.price *
                                  cartProducts.filter(
                                    (elm) => elm.id == quickViewItem.id
                                  )[0].quantity
                                ).toFixed(2)
                              : (quickViewItem.price * quantity).toFixed(2)}
                          </span>
                        </a>
                        <a
                          href="#compare"
                          onClick={() => addToCompareItem(quickViewItem.id)}
                          data-bs-toggle="offcanvas"
                          aria-controls="compare"
                          className="box-icon hover-tooltip compare btn-icon-action show-compare"
                        >
                          <span className="icon icon-gitDiff" />
                          <span className="tooltip text-caption-2">
                            {" "}
                            {isAddedtoCompareItem(quickViewItem.id)
                              ? "Already compared"
                              : "Compare"}
                          </span>
                        </a>
                        <a
                          onClick={() => addToWishlist(quickViewItem.id)}
                          className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                        >
                          <span className="icon icon-heart" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoWishlist(quickViewItem.id)
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
