"use client";
import React from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
export default function Hero({ slides = [] }) {
  return (
    <div className="tf-slideshow slider-default slider-effect-fade">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        spaceBetween={0}
        className="swiper tf-sw-slideshow"
        pagination={{
          clickable: true,
          el: ".spd41",
        }}
        dir="ltr"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="wrap-slider">
              <Image
                alt={slide.alt}
                src={slide.imgSrc}
                width={1920}
                height={800}
              />
              <div className="box-content">
                <div className="content-slider">
                  <div className="box-title-slider">
                    <p className="fade-item fade-item-1 subheading text-btn-uppercase text-white">
                      {slide.subtitle}
                    </p>
                    <div
                      className="fade-item fade-item-2 heading text-white title-display"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    ></div>
                  </div>
                  <div className="fade-item fade-item-3 box-btn-slider">
                    <Link
                      href={`/shop-default-grid`}
                      className="tf-btn btn-fill btn-white"
                    >
                      <span className="text">{slide.linkText}</span>
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
          <div className="sw-dots sw-pagination-slider type-circle white-circle justify-content-center spd41" />
        </div>
      </div>
    </div>
  );
}
