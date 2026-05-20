"use client";
import React, { useEffect, useState } from "react";
import Slider1 from "../sliders/Slider1";
import ColorSelect from "../ColorSelect";
import SizeSelect from "../SizeSelect";
import QuantitySelect from "../QuantitySelect";
import Image from "next/image";
import { useContextElement } from "@/app/newSite-context/Context";
import ProductStikyBottom from "../ProductStikyBottom";
export default function DetailsExternal({ product }) {
  const [activeColor, setActiveColor] = useState("gray");
  const [quantity, setQuantity] = useState(1);
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    addToWishlist,
    isAddedtoWishlist,
    cartProducts,
    isAddedtoCompareItem,
    updateQuantity,
  } = useContextElement();
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
                  firstItem={product.imgSrc}
                />
              </div>
            </div>
            {/* /Product default */}
            {/* tf-product-info-list */}
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-heading">
                    <div className="tf-product-info-name">
                      <div className="text text-btn-uppercase">Clothing</div>
                      <h3 className="name">{product.title}</h3>
                      <div className="sub">
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
                      </div>
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
                        The garments labelled as Committed are products that
                        have been produced using sustainable fibres or
                        processes, reducing their environmental impact.
                      </p>
                      <div className="tf-product-info-liveview">
                        <i className="icon icon-eye" />
                        <p className="text-caption-1">
                          <span className="liveview-count">28</span> people are
                          viewing this right now
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-choose-option">
                    <ColorSelect
                      setActiveColor={setActiveColor}
                      activeColor={activeColor}
                    />
                    <SizeSelect />
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
                          href="#"
                          className="btn-style-5 text-btn-uppercase flex-grow-1 radius-60"
                        >
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19.3751 13.1233V15.6233C19.3751 15.789 19.3093 15.948 19.1921 16.0652C19.0748 16.1824 18.9159 16.2483 18.7501 16.2483C18.5844 16.2483 18.4254 16.1824 18.3082 16.0652C18.191 15.948 18.1251 15.789 18.1251 15.6233V14.6319L17.9525 14.8053C17.7103 15.0686 14.8001 18.1233 10.0001 18.1233C5.09074 18.1233 2.15792 14.9272 2.03527 14.7912C1.92442 14.6674 1.86728 14.5047 1.87644 14.3388C1.8856 14.1728 1.96029 14.0173 2.0841 13.9065C2.2079 13.7956 2.37067 13.7385 2.53659 13.7477C2.70252 13.7568 2.85801 13.8315 2.96886 13.9553C2.98996 13.9827 5.66417 16.8733 10.0001 16.8733C14.3361 16.8733 17.0103 13.9827 17.0368 13.9545C17.0434 13.9464 17.0505 13.9385 17.0579 13.9311L17.2415 13.7483H16.2501C16.0844 13.7483 15.9254 13.6824 15.8082 13.5652C15.691 13.448 15.6251 13.289 15.6251 13.1233C15.6251 12.9575 15.691 12.7985 15.8082 12.6813C15.9254 12.5641 16.0844 12.4983 16.2501 12.4983H18.7501C18.9159 12.4983 19.0748 12.5641 19.1921 12.6813C19.3093 12.7985 19.3751 12.9575 19.3751 13.1233ZM12.5001 7.38343V6.56078C12.5005 5.92882 12.2881 5.31514 11.8971 4.81869C11.5061 4.32223 10.9592 3.97193 10.3448 3.82427C9.7303 3.67661 9.08401 3.7402 8.51011 4.00478C7.93621 4.26936 7.46813 4.71951 7.18136 5.28265C7.10594 5.43028 6.97496 5.54191 6.81724 5.59297C6.65952 5.64403 6.48798 5.63034 6.34035 5.55492C6.19272 5.4795 6.08109 5.34852 6.03003 5.1908C5.97897 5.03308 5.99266 4.86153 6.06808 4.7139C6.4825 3.90075 7.15866 3.25084 7.98758 2.86891C8.81649 2.48699 9.74986 2.39531 10.6372 2.60865C11.5246 2.82199 12.3143 3.32792 12.879 4.04489C13.4438 4.76187 13.7506 5.64811 13.7501 6.56078V13.7483C13.7501 13.914 13.6843 14.073 13.5671 14.1902C13.4498 14.3074 13.2909 14.3733 13.1251 14.3733C12.9594 14.3733 12.8004 14.3074 12.6832 14.1902C12.566 14.073 12.5001 13.914 12.5001 13.7483V13.2381C11.9259 13.7906 11.202 14.1621 10.4183 14.3062C9.63458 14.4504 8.82581 14.3609 8.0926 14.0489C7.35939 13.7369 6.73412 13.2162 6.29462 12.5515C5.85511 11.8868 5.62078 11.1076 5.62078 10.3108C5.62078 9.51395 5.85511 8.73471 6.29462 8.07004C6.73412 7.40538 7.35939 6.88464 8.0926 6.57264C8.82581 6.26064 9.63458 6.17116 10.4183 6.31532C11.202 6.45948 11.9259 6.83093 12.5001 7.38343ZM12.5001 10.3108C12.5001 9.75452 12.3352 9.21075 12.0261 8.74824C11.7171 8.28572 11.2778 7.92524 10.7639 7.71237C10.25 7.4995 9.68449 7.4438 9.13892 7.55232C8.59335 7.66084 8.09221 7.92871 7.69887 8.32204C7.30554 8.71538 7.03767 9.21652 6.92915 9.76209C6.82063 10.3077 6.87633 10.8732 7.0892 11.3871C7.30207 11.901 7.66256 12.3402 8.12507 12.6493C8.58758 12.9583 9.13135 13.1233 9.68761 13.1233C10.057 13.1233 10.4227 13.0505 10.7639 12.9092C11.1051 12.7678 11.4152 12.5607 11.6763 12.2995C11.9375 12.0384 12.1447 11.7283 12.286 11.3871C12.4274 11.0458 12.5001 10.6801 12.5001 10.3108Z"
                              fill="#181818"
                            />
                          </svg>
                          Buy Theme On Amazon - $79.99
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
                </div>
              </div>
            </div>
            {/* /tf-product-info-list */}
          </div>
        </div>
      </div>
      <ProductStikyBottom />
    </section>
  );
}
