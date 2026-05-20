"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
export default function Brands({ parentClass = "flat-spacing-5 line-top", brands = [] }) {
  return (
    <section className={parentClass}>
      <Swiper
        dir="ltr"
        className="swiper tf-sw-partner sw-auto"
        spaceBetween={50} // Equivalent to data-space={50}
        loop={true} // Equivalent to data-loop="true"
        autoplay={{ delay: 0 }} // Equivalent to data-auto-play="true" with a delay of 0
        breakpoints={{
          1024: {
            slidesPerView: "auto", // Equivalent to data-preview="auto"
            spaceBetween: 74, // Equivalent to data-space-lg={74}
          },
          768: {
            slidesPerView: "auto", // Equivalent to data-tablet="auto"
            spaceBetween: 50, // Equivalent to data-space-md={50}
          },
          0: {
            slidesPerView: 2, // Equivalent to data-mobile={2}
            spaceBetween: 50, // Equivalent to data-space={50}
          },
        }}
      >
        {brands.map((brand) => (
          <SwiperSlide key={brand.id}>
            <a href="#" className="brand-item">
              <Image
                alt={brand.alt}
                src={brand.imgSrc}
                width={brand.width}
                height={brand.height}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
