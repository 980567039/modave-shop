"use client";

import ProductCard1 from "@/app/newSite-components/productCards/ProductCard1";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products6({ products = [] }) {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Top Trending</h3>
          <p className="subheading text-secondary">
            Browse our Top Trending: the hottest picks loved by all.
          </p>
        </div>

        <Swiper
          spaceBetween={15}
          dir="ltr"
          className="swiper tf-sw-latest"
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 15 },

            768: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {products.slice(4).map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard1 product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
