import React from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/app/newSite-components/common/Countdown";
export default function BannerCountdown() {
  return (
    <section className="bg-surface flat-spacing flat-countdown-banner">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="banner-left">
              <div className="box-title">
                <h3 className="wow fadeInUp">Limited-Time Deals On!</h3>
                <p className="text-secondary wow fadeInUp">
                  Up to 50% Off Selected Styles. Don't Miss Out.
                </p>
              </div>
              <div className="btn-banner wow fadeInUp">
                <Link href={`/shop-default-grid`} className="tf-btn btn-fill">
                  <span className="text">Shop Now</span>
                  <i className="icon icon-arrowUpRight" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="banner-img">
              <Image
                className="lazyload"
                data-src="/newSite-images/banner/img-countdown1.png"
                alt="banner"
                src="/newSite-images/banner/img-countdown1.png"
                width={607}
                height={655}
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="banner-right">
              <div className="tf-countdown-lg">
                <div
                  className="js-countdown"
                  data-timer={1007500}
                  data-labels="Days,Hours,Mins,Secs"
                >
                  <CountdownTimer style={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
