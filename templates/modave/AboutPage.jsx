import Brands from "@/app/newSite-components/common/Brands";
import Features2 from "@/app/newSite-components/common/Features2";
import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Link from "next/link";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import About from "@/app/newSite-components/otherPages/About";
import Team from "@/app/newSite-components/otherPages/Team";
import Testimonials from "@/app/newSite-components/otherPages/Testimonials";
import React from "react";
import { brands } from "@/app/newSite-data/brands";
import { iconboxItems } from "@/app/newSite-data/features";

export default function AboutUsPage() {
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/newSite-images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">About Our Store</h3>
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
                  <a className="link" href="#">
                    Pages
                  </a>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>About Our Store</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <About />
      <Features2 parentClass="flat-spacing line-bottom-container" iconboxItems={iconboxItems} />
      <Team />
      <Brands parentClass="flat-spacing-5 bg-surface" brands={brands} />
      <Testimonials />
      <Footer1 />
    </>
  );
}
