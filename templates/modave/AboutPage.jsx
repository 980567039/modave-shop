import { Brands } from "@/templates/modave/components/common";
import { Features2 } from "@/templates/modave/components/common";
import { Footer1 } from "@/templates/modave/components/footers";
import { Header1 } from "@/templates/modave/components/headers";
import Link from "next/link";
import { Topbar6 } from "@/templates/modave/components/headers";
import { About, Team, Testimonials } from "@/templates/modave/components/other-pages";
import React from "react";
import { aboutPageContent } from "@/templates/modave/data/aboutPage";

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
      <Features2
        parentClass="flat-spacing line-bottom-container"
        iconboxItems={aboutPageContent.featureItems}
      />
      <Team />
      <Brands parentClass="flat-spacing-5 bg-surface" brands={aboutPageContent.brands} />
      <Testimonials />
      <Footer1 />
    </>
  );
}
