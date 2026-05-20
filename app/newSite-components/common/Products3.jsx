"use client";
import ProductCard1 from "@/app/newSite-components/productCards/ProductCard1";
import React, { useEffect, useState } from "react";
import Link from "next/link";
const tabItems = ["New Arrivals", "Best Seller", "On Sale"];
export default function Products3({ parentClass = "flat-spacing-3", latestArrival, products = [] }) {
  const [activeItem, setActiveItem] = useState(tabItems[0]); // Default the first item as active
  const [selectedItems, setSelectedItems] = useState([]);
  // console.log(latestArrival, 'latestArrivallatestArrivallatestArrival')
  // useEffect(() => {
  //   document.getElementById("newArrivals").classList.remove("filtered");
  //   setTimeout(() => {
  //     setSelectedItems(
  //       products.filter((elm) => elm.tabFilterOptions2.includes(activeItem))
  //     );
  //     document.getElementById("newArrivals").classList.add("filtered");
  //   }, 300);
  // }, [activeItem]);
  return (
    <section className={parentClass}>
      <div className="container">
        <div className="flat-animate-tab">
          <ul className="tab-product justify-content-sm-center" role="tablist">
            {tabItems.map((item) => (
              <li key={item} className="nav-tab-item">
                <a
                  href={`#`} // Generate href dynamically
                  className={activeItem === item ? "active" : ""}
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
          <div className="tab-content">
            <div
              className="tab-pane active show tabFilter filtered"
              id="newArrivals"
              role="tabpanel"
            >
              <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
                {(products[tabItems.indexOf(activeItem)]?.products)?.map((product, i) => (
                  product.visibility &&
                  <ProductCard1 key={i} product={product} />
                ))}
              </div>
              <div className="sec-btn text-center">
                <Link href={`/shop-default-grid`} className="btn-line">
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
