"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useContextElement } from "@/app/newSite-context/Context";
import { Pagination } from "swiper/modules";
export default function Testimonials2({ testimonials = [] }) {
  const { setQuickViewItem } = useContextElement();
  return (
    <section className="flat-spacing-6">
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Customer Say!</h3>
          <p className="subheading wow fadeInUp">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>
        <Swiper
          dir="ltr"
          className="swiper tf-sw-testimonial wow fadeInUp"
          data-wow-delay="0.1s"
          spaceBetween={15}
          breakpoints={{
            1024: { slidesPerView: 2 }, // data-preview for larger screens
            768: { slidesPerView: 1.3 }, // data-tablet
            0: { slidesPerView: 1 }, // data-mobile
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            clickable: true,
            el: ".spd32",
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div className="testimonial-item hover-img">
                <div className="img-style">
                  <Image
                    data-src={item.imgSrc}
                    alt={item.alt}
                    src={item.imgSrc}
                    width={351}
                    height={468}
                  />
                  <a
                    href="#quickView"
                    onClick={() => setQuickViewItem(item)}
                    data-bs-toggle="modal"
                    className="box-icon hover-tooltip center"
                  >
                    <span className="icon icon-eye" />
                    <span className="tooltip">Quick View</span>
                  </a>
                </div>
                <div className="content">
                  <div className="content-top">
                    <div className="list-star-default">
                      {[...Array(5)].map((_, i) => (
                        <i className="icon icon-star" key={i} />
                      ))}
                    </div>
                    <p className="text-secondary">{item.quote}</p>
                    <div className="box-author">
                      <div className="text-title author">{item.author}</div>
                      <svg
                        className="icon"
                        width={20}
                        height={21}
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG content */}
                      </svg>
                    </div>
                  </div>
                  <div className="box-avt">
                    <div className="avatar avt-60 round">
                      <Image
                        alt="avt"
                        src={item.avatar}
                        width={351}
                        height={468}
                      />
                    </div>
                    <div className="box-price">
                      <p className="text-title text-line-clamp-1">
                        {item.title}
                      </p>
                      <div className="text-button price">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd32" />
        </Swiper>
      </div>
    </section>
  );
}
