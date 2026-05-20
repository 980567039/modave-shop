"use client";
import Link from "next/link";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
export default function CollectionBanner({ banners = [] }) {
  return (
    <section className="px_15 px_xl-40 flat-spacing-9 pt-0">
      <Swiper
        dir="ltr"
        className="swiper tf-sw-testimonial"
        spaceBetween={15}
        breakpoints={{
          0: { slidesPerView: 1 },
          575: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1.3,
            spaceBetween: 30,
          },
          992: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
        }}
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: ".spd10",
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="swiper-slide">
            <div
              className="collection-default abs-left-bottom type-xl radius-20 hover-img wow fadeInUp"
              data-wow-delay="0s"
            >
              <a className="img-style">
                <Image
                  className="lazyload"
                  data-src={banner.imageSrc}
                  alt="banner-cls"
                  src={banner.imageSrc}
                  width={banner.width}
                  height={banner.height}
                />
              </a>
              <div className="content text-start">
                <div className="box-title">
                  <h3 className="title">
                    <Link
                      href={`/shop-default-grid`} // Link added directly in JSX
                      className="link text-white"
                    >
                      {banner.title}
                    </Link>
                  </h3>
                  <p className="text-white">{banner.description}</p>
                </div>
                <div className="box-btn">
                  <Link
                    href={`/shop-default-grid`} // Link added directly in JSX
                    className="btn-line style-white"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd10" />
      </Swiper>
    </section>
  );
}
