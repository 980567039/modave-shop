"use client";

import { useContextElement } from "@/app/newSite-context/Context";
import { useEffect, useState } from "react";
import ProductCard1 from "../productCards/ProductCard1";
import Pagination from "../common/Pagination";
import Link from "next/link";
import { allProducts } from "@/app/newSite-data/products";

export default function Wishlist() {
  const { removeFromWishlist, wishList } = useContextElement();
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems([...allProducts.filter((elm) => wishList.includes(elm.id))]);
  }, [wishList]);
  return (
    <section className="flat-spacing">
      <div className="container">
        {items.length ? (
          <div className="tf-grid-layout tf-col-2 md-col-3 xl-col-4">
            {/* card product 1 */}
            {items.map((product, i) => (
              <ProductCard1 key={i} product={product} />
            ))}

            {/* pagination */}
            <ul className="wg-pagination justify-content-center">
              <Pagination />
            </ul>
          </div>
        ) : (
          <div className="p-5">
            Your wishlist is empty. Start adding your favorite products to save
            them for later!{" "}
            <Link className="btn-line" href="/newSite/shop-default-grid">
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
