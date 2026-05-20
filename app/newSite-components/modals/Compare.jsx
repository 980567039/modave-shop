"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/app/newSite-context/Context";
export default function Compare() {
  const { removeFromCompareItem, compareItem, setCompareItem } =
    useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(compareItem.filter((item) => typeof item === "object"));
  }, [compareItem]);

  return (
    <div className="offcanvas offcanvas-bottom offcanvas-compare" id="compare">
      <div className="offcanvas-content">
        <div className="header">
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="wrap">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tf-compare-list list-file-delete">
                  <div className="tf-compare-head">
                    <h5 className="title">
                      Compare <br />
                      Products
                    </h5>
                  </div>
                  {items.length ? (
                    <div className="tf-compare-wrap">
                      {items.map((elm, i) => (
                        <div key={elm._id || elm.id || i} className="tf-compare-item file-delete">
                          <span className="btns-repeat">
                            <svg
                              width={16}
                              height={17}
                              viewBox="0 0 16 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_5628_27)">
                                <path
                                  d="M11.334 1.33301L14.0007 3.99967L11.334 6.66634"
                                  stroke="#181818"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2 7.99951V6.66618C2 5.95893 2.28095 5.28066 2.78105 4.78056C3.28115 4.28046 3.95942 3.99951 4.66667 3.99951H14"
                                  stroke="#181818"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M4.66667 15.9996L2 13.3329L4.66667 10.6663"
                                  stroke="#181818"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 9.33301V10.6663C14 11.3736 13.719 12.0519 13.219 12.552C12.7189 13.0521 12.0406 13.333 11.3333 13.333H2"
                                  stroke="#181818"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_5628_27">
                                  <rect
                                    width={16}
                                    height={16}
                                    fill="white"
                                    transform="translate(0 0.66626)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <span
                            className="icon-close remove"
                            style={{ cursor: "pointer" }}
                            onClick={() => removeFromCompareItem(elm._id || elm.id)}
                          />
                          <Link
                            href={`/product-detail/${elm._id || elm.id}`}
                            className="image"
                          >
                            <Image
                              className="lazyload"
                              alt=""
                              src={
                                elm.defaultImage?.url ||
                                elm.imgSrc ||
                                elm.image ||
                                elm.mainImage
                              }
                              width={600}
                              height={800}
                            />
                          </Link>
                          <div className="content">
                            <div className="text-title">
                              <Link
                                className="link text-line-clamp-2"
                                href={`/product-detail/${elm._id || elm.id}`}
                              >
                                {elm.title}
                              </Link>
                            </div>
                            <div className="text-button">
                              ${(Number(elm.price) || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      No items added to compare yet. Browse Products to find
                      items you’d like to compare.
                    </div>
                  )}
                  <div className="tf-compare-buttons">
                    <div className="tf-compare-buttons-wrap">
                      <Link
                        href={`/compare-products`}
                        className="tf-btn w-100 btn-fill radius-4"
                      >
                        <span className="text text-btn-uppercase">
                          Compare Products
                        </span>
                      </Link>
                      <div
                        onClick={() => setCompareItem([])}
                        className="tf-compapre-button-clear-all clear-file-delete tf-btn w-100 btn-white radius-4 has-border"
                      >
                        <span className="text text-btn-uppercase">
                          Clear All Products
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
