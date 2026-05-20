"use client";

import ProductCard4 from "@/app/newSite-components/productCards/ProductCard4";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { Pagination } from "swiper/modules";
export default function Products2({ products = [] }) {
  return (
    <section className="flat-spacing-4 pt-0">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h3>Today's Popular Picks</h3>
          <Link href={`/shop-default-grid`} className="line-under">
            See All Products
          </Link>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-recent"
          spaceBetween={30}
          breakpoints={{
            1200: {
              slidesPerView: 6,
            },
            768: {
              slidesPerView: 4,
            },
            480: {
              slidesPerView: 3,
            },
            0: {
              slidesPerView: 2,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd27",
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <ProductCard4 product={product} />
            </SwiperSlide>
          ))}

          <div className="sw-pagination-recent sw-dots type-circle justify-content-center spd27" />
        </Swiper>
      </div>
    </section>
  );
}
