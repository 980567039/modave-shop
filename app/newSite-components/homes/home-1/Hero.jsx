"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { slides } from "@/app/newSite-data/heroSlides";
import Image from "next/image";
import Link from "next/link";
export default function Hero({ data }) {
  return (
    <section className="tf-slideshow slider-default slider-effect-fade">
      <Swiper
        effect="fade"
        spaceBetween={0}
        centeredSlides={false}
        slidesPerView={1}
        loop={true}
        modules={[EffectFade, Autoplay, Pagination]}
        // autoplay={{ delay: 3000 }}
        dir="ltr"
        pagination={{
          clickable: true,
          el: ".spd55",
        }}
        className="swiper tf-sw-slideshow"
      >
        {data.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="wrap-slider">
              <Image
                alt={slide?.mainText || ''}
                src={slide.image}
                width={1920}
                height={803}
                priority
              />
              <div className="box-content">
                <div className="content-slider">
                  <div className="box-title-slider">
                    <p className="fade-item fade-item-1 subheading text-btn-uppercase text-white">
                      {slide.subheading}
                    </p>
                    <div className="fade-item fade-item-2 heading text-white title-display">
                      {slide.mainText?.split("\n").map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="fade-item fade-item-3 box-btn-slider">
                    <Link
                      href={`/shop-default-grid`}
                      className="tf-btn btn-fill btn-white"
                    >
                      <span className="text">{slide.btnText}</span>
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
          <div className="sw-dots sw-pagination-slider type-circle white-circle justify-content-center spd55" />
        </div>
      </div>
    </section>
  );
}
