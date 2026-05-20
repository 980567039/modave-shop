"use client";
import CountdownTimer from "@/app/newSite-components/common/Countdown";
import ProductCard1 from "@/app/newSite-components/productCards/ProductCard1";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products({ products = [] }) {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section-2 type-2 wow fadeInUp">
          <h3 className="heading">Today's Top Picks</h3>
          <div className="cd-category">
            <div
              className="js-countdown"
              data-timer={1007500}
              data-labels="d :,h :,m :,s"
            >
              <CountdownTimer style={5} />
            </div>
          </div>
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
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd4",
          }}
        >
          {products.map((product, i) => (
            <SwiperSlide key={i}>
              <ProductCard1
                parentClass="card-product wow fadeInUp"
                isNotImageRatio
                product={product}
              />
            </SwiperSlide>
          ))}

          <div className="sw-pagination-latest sw-dots type-circle justify-content-center spd4" />
        </Swiper>
      </div>
    </section>
  );
}
