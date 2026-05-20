"use client";

import { apiReq } from "@/lib/common";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard1 from "../productCards/ProductCard1";
import { Pagination } from "swiper/modules";

export default function RecentProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiReq("site/product?limit=8", "GET");
        const { data } = await response.json();
        if (data && data.products) {
          // Map _id to id for compatibility
          const mappedProducts = data.products.map(p => ({ ...p, id: p._id }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h4 className="heading">You may also like</h4>
        </div>
        {products.length > 0 && (
          <Swiper
            className="swiper tf-sw-latest"
            dir="ltr"
            spaceBetween={15}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd79",
            }}
          >
            {products.slice(0, 4).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard1 product={product} />
              </SwiperSlide>
            ))}

            <div className="sw-pagination-latest sw-dots type-circle justify-content-center spd79" />
          </Swiper>
        )}
      </div>
    </section>
  );
}
