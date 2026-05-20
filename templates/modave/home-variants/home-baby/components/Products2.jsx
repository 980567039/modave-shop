"use client";
import ProductCard1 from "@/app/newSite-components/productCards/ProductCard1";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products2({ products = [] }) {
  return (
    <section className="flat-spacing">
      <div className="container container-2">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Best Sellers</h3>
          <p className="subheading wow fadeInUp">
            Fresh styles just in! Elevate your look.
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-latest"
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 2 },
            575: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={i}>
              <ProductCard1
                product={product}
                isNotImageRatio
                parentClass="card-product wow fadeInUp"
                radiusClass="radius-12"
              />
            </SwiperSlide>
          ))}

          <div className="sec-btn text-center">
            <Link href={`/shop-default-grid`} className="btn-line">
              View All Products
            </Link>
          </div>
        </Swiper>
      </div>
    </section>
  );
}
