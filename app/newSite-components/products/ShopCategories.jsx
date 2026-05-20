"use client";

import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";

export default function ShopCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/site/categories");
        if (res.ok) {
          const data = await res.json();
          // data.data contains the list
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="flat-spacing">
      <div className="container">
        <Swiper
          dir="ltr"
          slidesPerView={5}
          spaceBetween={20}
          breakpoints={{
            1200: { slidesPerView: 6, spaceBetween: 20 },
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
          {(loading ? Array(6).fill(null) : categories).map((collection, index) => (
            <SwiperSlide key={index}>
              {loading ? (
                <div className="collection-circle">
                  <div className="img-style" style={{ aspectRatio: '1/1', borderRadius: '50%', backgroundColor: '#f0f0f0' }}></div>
                  <div className="collection-content text-center">
                    <div style={{ height: '20px', width: '60%', backgroundColor: '#f0f0f0', margin: '10px auto', borderRadius: '4px' }}></div>
                    <div style={{ height: '14px', width: '40%', backgroundColor: '#f0f0f0', margin: '5px auto', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ) : (
                <div className="collection-circle hover-img">
                  <Link href={`/shop-collection?slug=${collection.slug}`} className="img-style">
                    <Image
                      className="lazyload"
                      data-src={collection.categoryImage?.url || "/newSite-images/collections/collection-circle/cls-circle1.jpg"}
                      alt={collection.title}
                      src={collection.categoryImage?.url || "/newSite-images/collections/collection-circle/cls-circle1.jpg"}
                      width={363}
                      height={363}
                    />
                  </Link>
                  <div className="collection-content text-center">
                    <div>
                      <Link href={`/shop-collection?slug=${collection.slug}`} className="cls-title">
                        <h6 className="text">{collection.title}</h6>
                        <i className="icon icon-arrowUpRight" />
                      </Link>
                    </div>
                    <div className="count text-secondary">{collection.productCount || 0} items</div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="d-flex d-lg-none sw-pagination-collection sw-dots type-circle justify-content-center spd54" />
      </div>
    </section>
  );
}
