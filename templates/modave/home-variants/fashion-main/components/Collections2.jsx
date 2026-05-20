"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
export default function Collections2({ collections = [] }) {
  return (
    <section>
      <Swiper
        spaceBetween={8}
        slidesPerView={3}
        breakpoints={{
          1124: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 10 },
          0: { slidesPerView: 1, spaceBetween: 8 },
        }}
        className="swiper tf-sw-collection"
        modules={[Pagination]}
        pagination={{
          clickable: true,
          el: ".spd40",
        }}
        dir="ltr"
      >
        {collections.map((collection) => (
          <SwiperSlide key={collection.id}>
            <div className="collection-position style-lg hover-img">
              <a className="img-style">
                <Image
                  className="lazyload"
                  data-src={collection.imgSrc}
                  alt={collection.alt}
                  src={collection.imgSrc}
                  width={collection.imgWidth}
                  height={collection.imgHeight}
                />
              </a>
              <div className="content">
                <h3 className="title wow fadeInUp">
                  <Link href={`/shop-collection`} className="link text-white">
                    {collection.title}
                  </Link>
                </h3>
                <p
                  className="desc text-white wow fadeInUp"
                  data-wow-delay={collection.delay}
                >
                  {collection.description}
                </p>
                <div className="wow fadeInUp" data-wow-delay={collection.delay}>
                  <Link
                    href={`/shop-collection`}
                    className="btn-line style-white"
                  >
                    {collection.btnText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="sw-pagination-collection sw-dots type-circle justify-content-center spd40" />
      </Swiper>
    </section>
  );
}
