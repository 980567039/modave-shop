"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
export default function Collections2({ collections = [] }) {
  return (
    <section className="flat-spacing-4 pt-0">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h4>Our Featured Offers</h4>
          <Link href={`/shop-default-grid`} className="line-under">
            See All Offers
          </Link>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-products1"
          data-preview={4}
          data-tablet={4}
          data-mobile={2}
          spaceBetween={30}
          breakpoints={{
            768: {
              slidesPerView: 4,
            },

            0: {
              slidesPerView: 2,
            },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd24",
          }}
        >
          {collections.map(({ id, imgSrc, alt, heading, delay }) => (
            <SwiperSlide key={id} className="swiper-slide">
              <div
                className="collection-circle style-1 hover-img wow fadeInUp"
                data-wow-delay={delay}
              >
                <Link href={`/shop-default-grid`} className="img-style">
                  <Image
                    className="lazyload"
                    data-src={imgSrc}
                    alt={alt}
                    src={imgSrc}
                    width={361}
                    height={360}
                  />
                </Link>
                <div className="collection-content text-center">
                  <h5 className="heading">{heading}</h5>
                  <div>
                    <Link href={`/shop-default-grid`} className="btn-line">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="sw-pagination-products1 sw-dots type-circle justify-content-center spd24" />
        </Swiper>
      </div>
    </section>
  );
}
