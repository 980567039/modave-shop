"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ProductCard1 from "../productCards/ProductCard1";

export default function RelatedProducts({ product }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const categorySlug = product?.category?.[0]?.slug;
    const productId = product?._id || product?.id;

    async function fetchProducts() {
      try {
        const relatedUrl = categorySlug
          ? `/api/site/product?category=${encodeURIComponent(categorySlug)}&limit=8`
          : "/api/site/product?limit=8";

        const [relatedRes, recentRes] = await Promise.all([
          fetch(relatedUrl),
          fetch("/api/site/product?limit=8"),
        ]);

        if (!relatedRes.ok || !recentRes.ok) {
          throw new Error("Failed to fetch related products");
        }

        const [relatedJson, recentJson] = await Promise.all([
          relatedRes.json(),
          recentRes.json(),
        ]);

        if (!isMounted) return;

        const filterCurrentProduct = (items = []) =>
          items.filter((item) => (item._id || item.id) !== productId);

        setRelatedProducts(
          filterCurrentProduct(relatedJson.data?.products || []).slice(0, 4)
        );
        setRecentProducts(
          filterCurrentProduct(recentJson.data?.products || []).slice(0, 4)
        );
      } catch (error) {
        console.error("Error loading related products:", error);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [product]);

  if (!relatedProducts.length && !recentProducts.length) return null;

  return (
    <section className="flat-spacing">
      <div className="container flat-animate-tab">
        <ul
          className="tab-product justify-content-sm-center wow fadeInUp"
          data-wow-delay="0s"
          role="tablist"
        >
          <li className="nav-tab-item" role="presentation">
            <a href="#ralatedProducts" className="active" data-bs-toggle="tab">
              Related Products
            </a>
          </li>
          <li className="nav-tab-item" role="presentation">
            <a href="#recentlyViewed" data-bs-toggle="tab">
              Latest Products
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane active show"
            id="ralatedProducts"
            role="tabpanel"
          >
            <ProductCarousel products={relatedProducts} paginationClass="spd4" />
          </div>
          <div className="tab-pane" id="recentlyViewed" role="tabpanel">
            <ProductCarousel products={recentProducts} paginationClass="spd5" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCarousel({ products, paginationClass }) {
  if (!products.length) {
    return <div className="text-center text-secondary p-4">No products available.</div>;
  }

  return (
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
        el: `.${paginationClass}`,
      }}
    >
      {products.map((item) => (
        <SwiperSlide key={item._id || item.id} className="swiper-slide">
          <ProductCard1 product={item} />
        </SwiperSlide>
      ))}

      <div
        className={`sw-pagination-latest ${paginationClass} sw-dots type-circle justify-content-center`}
      />
    </Swiper>
  );
}
