"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
export default function Collections({ categories = [] }) {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h3 className="heading">Explore Collections</h3>
          <Link href={`/shop-collection`} className="btn-line">
            View All Collection
          </Link>
        </div>
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          breakpoints={{
            1024: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            0: { slidesPerView: 1, spaceBetween: 10 },
          }}
          className="swiper tf-sw-categories"
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd39",
          }}
          dir="ltr"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <div
                className="collection-position-2 style-2 hover-img wow fadeInUp"
                data-wow-delay={category.delay}
              >
                <a className="img-style">
                  <Image
                    className="lazyload"
                    data-src={category.imgSrc}
                    alt={category.alt}
                    src={category.imgSrc}
                    width={category.imgWidth}
                    height={category.imgHeight}
                  />
                </a>
                <div className="content">
                  <Link href={`/shop-collection`} className="cls-btn">
                    <h6 className="text">{category.title}</h6>
                    <span className="count-item text-secondary">
                      {category.itemsCount}
                    </span>
                    <i className="icon icon-arrowUpRight" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-pagination-categories sw-dots type-circle justify-content-center spd39" />
        </Swiper>
      </div>
    </section>
  );
}
