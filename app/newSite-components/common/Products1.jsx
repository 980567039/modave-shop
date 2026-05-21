"use client";
import ProductCard1 from "@/app/newSite-components/productCards/ProductCard1";
import React, { useEffect, useState } from "react";
import Link from "next/link";
export default function Products({ 
  parentClass = "flat-spacing-3 pt-0",
  products = [],
  tabItems = ["Bottoms", "On pieces", "Tops", "Skirts", "Dresses", "Sale"]
}) {
  const [activeItem, setActiveItem] = useState(tabItems[0]); // Default the first item as active

  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="heading-section text-center wow fadeInUp">
          <h3>Today&apos;s Top Picks</h3>
          <ul className="tab-product-v2 justify-content-sm-center">
            {tabItems.map((item) => (
              <li key={item} className="nav-tab-item">
                <a
                  className={activeItem === item ? "active" : ""}
                  onClick={() => setActiveItem(item)}
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
              id="newArrivals2"
              role="tabpanel"
            >
              <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
                {selectedItems.map((product, i) => (
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
