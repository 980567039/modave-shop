"use client";

import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
export default function Hero({ slides = [] }) {
  return (
    <div className="tf-slideshow slider-style2 slider-electronic slider-position slider-effect-fade">
      <Swiper
        effect="fade"
        dir="ltr"
        className="swiper tf-sw-slideshow"
        loop={true}
        autoplay={true}
        modules={[EffectFade, Autoplay, Pagination]}
        spaceBetween={0}
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
        }}
        pagination={{
          clickable: true,
          el: ".spd25",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="wrap-slider">
              <Image
                alt="slideshow"
                src={slide.imgSrc}
                width={1921}
                height={600}
              />
              <div className="box-content">
                <div className="container">
                  <div className="content-slider">
                    <div className="box-title-slider">
                      <div>
                        <p className="fade-item fade-item-1 subtitle text-btn-uppercase text-primary">
                          {slide.subtitle}
                        </p>
                        <div
                          className="fade-item fade-item-2 title-display heading"
                          dangerouslySetInnerHTML={{ __html: slide.title }}
                        ></div>
                      </div>
                      <p className="fade-item fade-item-3 body-text-1 subheading">
                        {slide.description}
                      </p>
                    </div>
                    <div className="fade-item fade-item-4 box-btn-slider">
                      <Link
                        href={`/shop-default-grid`}
                        className="tf-btn btn-fill"
                      >
                        <span className="text">Shop Now</span>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="wrap-pagination d-block">
        <div className="container">
          <div className="sw-dots sw-pagination-slider type-square justify-content-center spd25" />
        </div>
      </div>
    </div>
  );
}
