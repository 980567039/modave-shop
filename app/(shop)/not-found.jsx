import Image from "next/image";
import React from "react";
import Link from "next/link";
export const metadata = {
  title:
    "Page Not Found || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default function PageNotFoundPage() {
  return (
    <section className="flat-spacing page-404">
      <div className="container">
        <div className="page-404-inner">
          <div className="image">
            <Image
              className="lazyload"
              data-src="/newSite-images/section/404.png"
              alt="image"
              src="/newSite-images/section/404.png"
              width={679}
              height={701}
            />
          </div>
          <div className="content">
            <div className="heading">Oops!</div>
            <div>
              <h2 className="title mb_4">Something is Missing.</h2>
              <div className="text body-text-1 text-secondary">
                The page you are looking for cannot be found. take a break
                before trying again
              </div>
            </div>
            <Link href={`/`} className="tf-btn btn-fill">
              <span className="text text-button">Back To Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
