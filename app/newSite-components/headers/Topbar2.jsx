"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const topBarMessages = [
  {
    id: 1,
    message:
      "SPRING DEALS | 30% OFF EVERYTHING spending $220 or more | Use code: EXTRA30",
  },
  {
    id: 2,
    message:
      "Midseason Sale: 20% Off - Auto Applied at Checkout - Limited Time Only",
  },
];
export default function Topbar2({
  parentClass = "tf-topbar topbar-white bg-primary",
}) {
  return (
    <div className={parentClass}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-12 text-center">
            <div className="wrapper-slider-topbar">
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                modules={[Autoplay]}
                loop={true}
                autoplay={{ delay: 2000 }}
                speed={2000}
                className="swiper tf-sw-top_bar mx-0"
                dir="ltr"
              >
                {topBarMessages.map((item) => (
                  <SwiperSlide key={item.id}>
                    <p className="top-bar-text text-line-clamp-1 text-btn-uppercase fw-semibold letter-1">
                      {item.message}
                    </p>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
