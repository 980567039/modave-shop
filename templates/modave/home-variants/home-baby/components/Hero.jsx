"use client";
import Link from "next/link";
import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
export default function Hero({ slides = [] }) {
  return (
    <div className="slider-padding">
      <div className="tf-slideshow slider-default slider-position slider-effect-fade slider-radius-3">
        <Swiper
          dir="ltr"
          className="swiper tf-sw-slideshow"
          slidesPerView={1}
          loop
          modules={[Navigation, Pagination]}
          pagination={{
            clickable: true,
            el: ".spd1",
          }}
          navigation={{
            prevEl: ".snbp1",
            nextEl: ".snbn1",
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="swiper-slide">
              <div className="wrap-slider">
                <Image
                  alt="slideshow"
                  src={slide.imageSrc}
                  width={1840}
                  height={836}
                />
                <div className="box-content">
                  <div className="content-slider">
                    <div className="box-title-slider">
                      <div className="fade-item fade-item-1 title-display heading text-white">
                        {slide.title}
                      </div>
                      <p className="fade-item fade-item-2 body-text-1 text-white">
                        {slide.description}
                      </p>
                    </div>
                    <div className="fade-item fade-item-3 box-btn-slider">
                      <Link
                        href={`/shop-default-grid`} // Link added directly in JSX
                        className="tf-btn btn-fill btn-white"
                      >
                        <span className="text">Explore Collection</span>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="wrap-pagination">
          <div className="container">
            <div className="sw-dots sw-pagination-slider type-circle white-circle-line justify-content-center spd1" />
          </div>
        </div>
        <div className="navigation-prev-slider nav-sw nav-sw-left lg snbp1">
          <i className="icon icon-arrLeft" />
        </div>
        <div className="navigation-next-slider nav-sw nav-sw-right lg snbn1">
          <i className="icon icon-arrRight" />
        </div>
      </div>
    </div>
  );
}
