import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
export default function Topbar() {
  return (
    <div className="tf-topbar bg-main">
      <div className="container">
        <div className="tf-topbar_wrap d-flex align-items-center justify-content-center justify-content-xl-between">
          <ul className="topbar-left">
            <li>
              <a className="text-caption-1 text-white" href="tel:315-666-6688">
                315-666-6688
              </a>
            </li>
            <li>
              <a className="text-caption-1 text-white" href="#">
                themesflat@gmail.com
              </a>
            </li>
            <li>
              <Link
                className="text-caption-1 text-white text-decoration-underline"
                href={`/store-list`}
              >
                Our Store
              </Link>
            </li>
          </ul>
          <div className="topbar-right d-none d-xl-block">
            <div className="tf-cur justify-content-end">
              <div className="tf-currencies">
                <CurrencySelect light topStart />
              </div>
              <div className="tf-languages position-relative">
                <LanguageSelect
                  parentClassName="image-select center style-default type-languages color-white"
                  topStart={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
