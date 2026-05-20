import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import ProductCompare from "@/app/newSite-components/otherPages/ProductCompare";
import Link from "next/link";
import React from "react";

export default function CompareProductsPage() {
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/newSite-images/section/page-title.jpg)" }}
      >
        <div className="container">
          <h3 className="heading text-center">Compare Products</h3>
          <ul className="breadcrumbs d-flex align-items-center justify-content-center">
            <li>
              <Link className="link" href={`/`}>
                Homepage
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>
              <Link className="link" href={`/shop-default-grid`}>
                Shop
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>Compare</li>
          </ul>
        </div>
      </div>
      <ProductCompare />

      <Footer1 />
    </>
  );
}
