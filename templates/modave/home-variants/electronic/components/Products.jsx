"use client";

import ProductCard3 from "@/app/newSite-components/productCards/ProductCard3";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

const tabItems = ["All Products", "Smart Phone", "Electronic", "Audio"];
export default function Products({ products = [] }) {
  const [activeItem, setActiveItem] = useState(tabItems[0]); // Default the first item as active
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    document.getElementById("AllProducts").classList.remove("filtered");
    setTimeout(() => {
      if (activeItem == "All Products") {
        setSelectedItems(products);
      } else {
        setSelectedItems(
          products.filter((elm) => elm.tabFilterOptions?.includes(activeItem))
        );
      }

      document.getElementById("AllProducts").classList.add("filtered");
    }, 300);
  }, [activeItem]);

  return (
    <section className="flat-spacing-4 pt-0">
      <div className="container">
        <div className="heading-section-2 wow fadeInUp">
          <h4>Deal of the day</h4>
          <ul
            className="tab-product-v3 justify-content-sm-center mw-100p-scroll"
            role="tablist"
          >
            {tabItems.map((item) => (
              <li key={item} className="nav-tab-item" role="presentation">
                <a
                  href={`#`} // Generate href dynamically
                  className={`text-caption-1 ${
                    activeItem === item ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    setActiveItem(item);
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flat-animate-tab">
          <div className="tab-content">
            <div
              className="tab-pane active show tabFilter filtered"
              id="AllProducts"
              role="tabpanel"
            >
              <Swiper
                dir="ltr"
                className="swiper tf-sw-latest"
                breakpoints={{
                  1200: {
                    slidesPerView: 5,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  480: {
                    slidesPerView: 3,
                  },
                  0: {
                    slidesPerView: 2,
                  },
                }}
                spaceBetween={15}
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  el: ".spd26",
                }}
              >
                {selectedItems.map((product, index) => (
                  <SwiperSlide key={index} className="swiper-slide">
                    <ProductCard3 product={product} />
                  </SwiperSlide>
                ))}

                <div className="sw-pagination-latest sw-dots type-circle justify-content-center spd26" />
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
