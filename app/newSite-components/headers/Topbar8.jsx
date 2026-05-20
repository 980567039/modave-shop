"use client";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Topbar8() {
  return (
    <div className="tf-topbar topbar-white type-1">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-12 text-center">
            <div className="wrapper-slider-topbar">
              <Swiper
                dir="ltr"
                className="swiper tf-sw-top_bar"
                loop
                modules={[Autoplay, Navigation]}
                autoplay={{
                  delay: 2000,
                }}
                speed={2000}
                navigation={{
                  prevEl: ".snbp11",
                  nextEl: ".snbn11",
                }}
              >
                <SwiperSlide className="swiper-slide">
                  <p className="top-bar-text text-line-clamp-1 text-btn-uppercase fw-semibold letter-1">
                    Free shipping on all orders over
                    <span className="text-primary">$20.00</span>
                  </p>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <p className="top-bar-text text-line-clamp-1 text-btn-uppercase fw-semibold letter-1">
                    Midseason Sale: 20% Off - Auto Applied at Checkout - Limited
                    Time Only.
                  </p>
                </SwiperSlide>
              </Swiper>
              <div className="navigation-topbar nav-next-topbar snbp11">
                <span className="icon icon-arrLeft" />
              </div>
              <div className="navigation-topbar nav-prev-topbar snbn11">
                <span className="icon icon-arrRight" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
