"use client";
import Link from "next/link";
import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
export default function Categories({ categories = [] }) {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="heading-section-2 type-2 align-items-center wow fadeInUp">
          <h3 className="heading">Trending Categories</h3>
          <Link href={`/shop-collection`} className="btn-line">
            View All Products
          </Link>
        </div>
        <div
          className="flat-collection-circle wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <Swiper
            dir="ltr"
            className="swiper tf-sw-categories"
            modules={[Navigation, Pagination]}
            pagination={{
              clickable: true,
              el: ".spd3",
            }}
            navigation={{
              prevEl: ".snbp3",
              nextEl: ".snbn3",
            }}
            spaceBetween={15}
            breakpoints={{
              0: { slidesPerView: 2 },
              575: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
            }}
          >
            {categories.map((collection) => (
              <SwiperSlide key={collection.id} className="swiper-slide">
                <div className="collection-circle hover-img">
                  <Link href={`/shop-categories-top`} className="img-style">
                    {" "}
                    {/* Link added directly in JSX */}
                    <Image
                      className="lazyload"
                      data-src={collection.imageSrc}
                      alt="collection-img"
                      src={collection.imageSrc}
                      width={300}
                      height={300}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link href={`/shop-categories-top`} className="cls-title">
                        {" "}
                        {/* Link added directly in JSX */}
                        <h6 className="text">{collection.title}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                    <div className="count text-secondary">
                      {collection.count}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className="d-flex d-lg-none sw-pagination-categories sw-dots type-circle justify-content-center spd3" />
          </Swiper>
          <div className="nav-prev-categories d-none d-lg-flex nav-sw style-line nav-sw-left space-1 snbp3">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-categories d-none d-lg-flex nav-sw style-line nav-sw-right space-1 snbn3">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
