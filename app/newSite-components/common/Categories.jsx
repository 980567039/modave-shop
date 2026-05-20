"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper/modules";
export default function Categories({ parentClass = "flat-spacing pt-0", collectionItems = [] }) {
  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Shop by product type</h3>
        </div>
        <div
          className="flat-collection-circle wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <Swiper
            className="tf-sw-categories"
            slidesPerView={6}
            breakpoints={{
              1424: {
                slidesPerView: 6,
              },
              1024: {
                slidesPerView: 4,
              },
              668: {
                slidesPerView: 3,
              },
              0: {
                slidesPerView: 2,
              },
            }}
            dir="ltr"
            spaceBetween={15}
            modules={[Navigation]}
            navigation={{
              prevEl: ".snbp1",
              nextEl: ".snbn1",
            }}
          >
            {collectionItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="collection-circle hover-img">
                  <Link href={`/shop-collection`} className="img-style">
                    <Image
                      className="lazyload"
                      data-src={item.imgSrc}
                      alt={item.alt}
                      src={item.imgSrc}
                      width={285}
                      height={285}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link href={`/shop-collection`} className="cls-title">
                        <h6 className="text">{item.title}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                    <div className="count text-secondary">
                      {item.itemsCount}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-prev-categories d-none d-lg-flex nav-sw style-line nav-sw-left snbp1">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-categories d-none d-lg-flex nav-sw style-line nav-sw-right snbn1">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
