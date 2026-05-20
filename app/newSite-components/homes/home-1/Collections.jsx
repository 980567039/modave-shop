"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";

export default function Collections({ data = [] }) {
  // 如果没有数据,不渲染组件
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="flat-spacing-2 pb_0">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h3>Categories you might like</h3>
          <Link href={`/shop-collection`} className="btn-line">
            View All Collection
          </Link>
        </div>
        <div
          className="flat-collection-circle wow fadeInUp"
          data-wow-delay="0.1s"
        >
          <Swiper
            dir="ltr"
            slidesPerView={5}
            spaceBetween={20}
            breakpoints={{
              1200: { slidesPerView: 5, spaceBetween: 20 },
              1000: { slidesPerView: 4, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              0: { slidesPerView: 2, spaceBetween: 15 },
            }}
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: ".spd54",
            }}
            navigation={{
              prevEl: ".snbp12",
              nextEl: ".snbn12",
            }}
          >
            {data.map((category, index) => (
              <SwiperSlide key={category._id || index}>
                <div className="collection-circle hover-img">
                  <Link href={`/shop-collection`} className="img-style">
                    {(category?.categoryImage?.url || category?.categoryFeaturedImage?.url) && (
                      <Image
                        className="lazyload"
                        data-src={category?.categoryImage?.url || category?.categoryFeaturedImage?.url || ''}
                        alt={category.seoDescription || category.description || category?.categoryImage?.url || '111'}
                        src={category?.categoryImage?.url || category?.categoryFeaturedImage?.url || ''}
                        width={363}
                        height={363}
                      />
                    )}
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link href={`/shop-collection`} className="cls-title">
                        <h6 className="text">{category.name || category.title}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                    <div className="count text-secondary">
                      {category.productCount || category.count || '0 items'}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="d-flex d-lg-none sw-pagination-collection sw-dots type-circle justify-content-center spd54" />
          <div className="nav-prev-collection d-none d-lg-flex nav-sw style-line nav-sw-left snbp12">
            <i className="icon icon-arrLeft" />
          </div>
          <div className="nav-next-collection d-none d-lg-flex nav-sw style-line nav-sw-right snbn12">
            <i className="icon icon-arrRight" />
          </div>
        </div>
      </div>
    </section>
  );
}
