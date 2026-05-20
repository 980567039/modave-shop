"use client";

import { collections2 } from "@/app/newSite-data/collections";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ShopCategories2() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <Swiper
          dir="ltr"
          spaceBetween={15}
          className="swiper tf-sw-categories"
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 15 },
            568: { slidesPerView: 3, spaceBetween: 20 },
            968: { slidesPerView: 4, spaceBetween: 20 },
            1224: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {collections2.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="collection-position-2 hover-img">
                <a className="img-style">
                  <Image
                    className="lazyload"
                    data-src={slide.imgSrc}
                    alt={slide.alt}
                    src={slide.imgSrc}
                    width={363}
                    height={483}
                  />
                </a>
                <div className="content">
                  <Link href={`/shop-collection`} className="cls-btn">
                    <h6 className="text">{slide.text}</h6>
                    <i className="icon icon-arrowUpRight" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
