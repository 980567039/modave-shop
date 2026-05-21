"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import { useContextElement } from "@/app/newSite-context/Context";
export default function Testimonials({ parentClass = "flat-spacing", testimonials = [] }) {
  const { setQuickViewItem } = useContextElement();
  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading wow fadeInUp">Customer Say!</h3>
          <p className="subheading wow fadeInUp">
            Our customers adore our products, and we constantly aim to delight
            them.
          </p>
        </div>
        <div className="swiper tf-sw-testimonial">
          <Swiper
            breakpoints={{
              // Small devices (mobile)
              0: {
                slidesPerView: 1,
                spaceBetween: 15,
                pagination: { clickable: true },
              },
              // Medium devices (tablet)
              768: {
                spaceBetween: 30,
                slidesPerView: 1.3,
                pagination: { clickable: true },
              },
              // Large devices (desktop)
              1024: {
                spaceBetween: 30,
                slidesPerView: 2,
                pagination: { clickable: true },
              },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd7",
            }}
            dir="ltr"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="testimonial-item hover-img">
                  <div className="img-style">
                    <Image
                      src={testimonial.imgSrc || testimonial.imageSrc || "/newSite-images/products/womens/women-19.jpg"}
                      alt={testimonial.alt || testimonial.title || testimonial.product || "testimonial product"}
                      width={468}
                      height={624}
                    />
                    <a
                      href="#quickView"
                      onClick={() => setQuickViewItem(testimonial)}
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
                          <i key={i} className="icon icon-star" />
                        ))}
                      </div>
                      <p className="text-secondary">{testimonial.quote}</p>
                      <div className="box-author">
                        <div className="text-title author">
                          {testimonial.author}
                        </div>
                        <svg
                          className="icon"
                          width={20}
                          height={21}
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0)">
                            <path
                              d="M6.875 11.6255L8.75 13.5005L13.125 9.12549"
                              stroke="#3DAB25"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 18.5005C14.1421 18.5005 17.5 15.1426 17.5 11.0005C17.5 6.85835 14.1421 3.50049 10 3.50049C5.85786 3.50049 2.5 6.85835 2.5 11.0005C2.5 15.1426 5.85786 18.5005 10 18.5005Z"
                              stroke="#3DAB25"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0">
                              <rect
                                width={20}
                                height={20}
                                fill="white"
                                transform="translate(0 0.684082)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="box-avt">
                      <div className="avatar avt-60 round">
                        <Image
                          alt="avt"
                          src={testimonial.avatar || testimonial.avatarSrc || "/newSite-images/avatar/user-1.jpg"}
                          width={90}
                          height={91}
                        />
                      </div>
                      <div className="box-price">
                        <p className="text-title text-line-clamp-1">
                          {testimonial.title}
                        </p>
                        <div className="text-button price">
                          ${(typeof testimonial.price === 'number') && testimonial.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="sw-pagination-testimonial sw-dots type-circle d-flex justify-content-center spd7" />
          </Swiper>
        </div>
      </div>
    </section>
  );
}
