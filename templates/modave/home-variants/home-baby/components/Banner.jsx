import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Banner({ data = {} }) {
  const {
    subtitle = "Upholstery",
    title = "Guide: Buying Shoes <br class='d-none d-md-block' /> For Kids",
    description = "Buying children’s shoes isn’t like buying shoes for yourself. Little feet grow fast, and kids are more likely to need weather-specific footwear than grown-ups - unless you also enjoy playing in puddles!",
    buttonText = "Shop Now",
    imageSrc = "/newSite-images/banner/banner-baby.jpg",
  } = data;

  return (
    <section className="flat-spacing pb-0">
      <div className="container">
        <div className="tf-grid-layout md-col-2 radius-20 gap-0 overflow-hidden">
          <div className="banner-text style-2 bg-brown-2 mb-0 d-md-flex flex-md-column justify-content-md-center h-md-100">
            <div className="box-title">
              <p className="text-btn-uppercase">{subtitle}</p>
              <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
              <p className="text-button fw-normal">{description}</p>
            </div>
            <div className="box-btn">
              <Link
                href="/newSite/shop-default-grid"
                className="btn-style-2 radius-12 btn-lg fw-semibold letter-0"
              >
                <span className="text-caption-1 lh-xl-20 text text-uppercase font-2">
                  {buttonText}
                </span>
              </Link>
            </div>
          </div>
          <div className="image-100">
            <Image
              src={imageSrc}
              alt="banner"
              className="lazyload"
              width={645}
              height={484}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
