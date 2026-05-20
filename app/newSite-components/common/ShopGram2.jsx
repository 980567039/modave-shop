"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
export default function ShopGram({ products = [] }) {
  return (
    <section>
      <div className="heading-section text-center wow fadeInUp">
        <h3 className="heading">Shop Instagram</h3>
        <p className="subheading text-secondary">
          Elevate your wardrobe with fresh finds today!
        </p>
      </div>
      <Swiper
        dir="ltr"
        className="swiper tf-sw-shop-gallery"
        spaceBetween={0}
        slidesPerView={2}
        breakpoints={{
          1200: { slidesPerView: 6, spaceBetween: 0 },

          768: { slidesPerView: 4, spaceBetween: 0 },
          640: { slidesPerView: 2, spaceBetween: 0 },
        }}
      >
        {products.map((product, i) => (
          <SwiperSlide key={i} className="swiper-slide">
            <div
              className="gallery-item rounded-0 hover-overlay hover-img wow fadeInUp"
              data-wow-delay={product.delay}
            >
              <div className="img-style">
                <Image
                  className="lazyload img-hover"
                  alt="image-gallery"
                  src={product.imgSrc}
                  width={640}
                  height={640}
                />
              </div>
              <Link
                href={`/product-detail/${product.id}`}
                className="box-icon hover-tooltip"
              >
                <span className="icon icon-eye" />
                <span className="tooltip">View Product</span>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
