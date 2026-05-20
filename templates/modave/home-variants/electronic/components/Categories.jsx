"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
export default function Categories({ categories = [] }) {
  return (
    <section className="flat-spacing-4">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3 className="heading">Popular Categories</h3>
        </div>
        <div
          className="flat-collection-circle wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <Swiper
            dir="ltr"
            className="swiper tf-sw-categories"
            slidesPerView={7} // Equivalent to data-preview
            breakpoints={{
              1200: { slidesPerView: 7 }, // Desktop view
              992: { slidesPerView: 4 }, // Tablet view
              576: { slidesPerView: 3 }, // Small tablet view
              0: { slidesPerView: 2 }, // Mobile view
            }}
            spaceBetween={15} // Equivalent to data-space
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: ".spd22",
            }}
            navigation={{
              prevEl: ".snbp8",
              nextEl: ".snbn8",
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div className="collection-circle hover-img">
                  <Link href={`/shop-categories-top`} className="img-style">
                    <Image
                      className="lazyload"
                      data-src={category.imgSrc}
                      alt={category.alt}
                      src={category.imgSrc}
                      width={253}
                      height={252}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link href={`/shop-categories-top`} className="cls-title">
                        <h6 className="text">{category.title}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div className="d-flex d-lg-none sw-pagination-categories sw-dots type-circle justify-content-center spd22" />
          </Swiper>
          <div className="nav-prev-categories d-none d-lg-flex nav-sw style-line nav-sw-left snbp8">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-categories d-none d-lg-flex nav-sw style-line nav-sw-right snbn8">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
