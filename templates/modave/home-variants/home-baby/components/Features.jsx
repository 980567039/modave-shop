"use client";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Features({ iconBoxes = [] }) {
  return (
    <section className="slider-padding">
      <div className="slider-icon-box bg-brown-3">
        <Swiper
          className="swiper tf-sw-iconbox swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden"
          spaceBetween={15}
          breakpoints={{
            0: { slidesPerView: 1 },
            575: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 45,
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 45,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spdfspd",
          }}
          dir="ltr"
        >
          {iconBoxes.map((box) => (
            <SwiperSlide key={box.id} className="swiper-slide">
              <div
                className={`tf-icon-box style-3 ${
                  box.lineRight ? "line-right" : ""
                } align-items-start`}
              >
                <div className="icon-box">
                  <span className={`icon ${box.icon}`} />
                </div>
                <div className="content">
                  <h5>{box.title}</h5>
                  <p className="text-secondary">{box.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="sw-pagination-iconbox sw-dots type-circle justify-content-center spdfspd" />
        </Swiper>
      </div>
    </section>
  );
}
