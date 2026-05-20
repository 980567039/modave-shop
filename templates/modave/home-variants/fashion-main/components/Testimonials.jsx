"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
export default function Testimonials({ testimonials = [] }) {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <Swiper
          spaceBetween={15}
          slidesPerView={1}
          breakpoints={{
            1024: { slidesPerView: 1, spaceBetween: 30 },
            768: { slidesPerView: 1, spaceBetween: 30 },
            640: { slidesPerView: 1, spaceBetween: 15 },
          }}
          className="swiper tf-sw-testimonial"
          modules={[Navigation]}
          speed={1500}
          navigation={{
            prevEl: ".snbp9",
            nextEl: ".snbn9",
          }}
          dir="ltr"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-item-v2 text-center">
                <div className="quote-box">
                  <span className="icon icon-quote" />
                  <div className="text-btn-uppercase text-secondary-2">
                    Customer Say!
                  </div>
                </div>
                <h4>"{testimonial.quote}"</h4>
                <div className="tes-box">
                  <div className="avatar round avt-60">
                    <Image
                      alt="avatar"
                      src={testimonial.avatarSrc}
                      width={90}
                      height={90}
                    />
                  </div>
                  <div className="info">
                    <div className="text-title title">
                      {testimonial.productTitle}
                    </div>
                    <span className="price text-button">
                      {testimonial.price}
                    </span>
                  </div>
                </div>
                <div className="rate-box">
                  <div className="list-star-default">
                    {Array.from({ length: testimonial.rating }, (_, index) => (
                      <i key={index} className="icon icon-star" />
                    ))}
                  </div>
                  <h6>
                    {testimonial.name}
                    <span className="text-title">
                      {" "}
                      {"/"} {testimonial.role}
                    </span>
                  </h6>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="box-navigation">
            <div className="nav-prev-testimonial nav-sw style-line nav-sw-left snbp9">
              <i className="icon icon-arrLeft" />
            </div>
            <div className="nav-next-testimonial nav-sw style-line nav-sw-right snbn9">
              <i className="icon icon-arrRight" />
            </div>
          </div>
        </Swiper>
      </div>
    </section>
  );
}
