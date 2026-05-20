import React from "react";
import Link from "next/link";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
export default function Topbar6({ bgColor = "bg-blue-2" }) {
  return (
    <div className={`tf-topbar ${bgColor}`}>
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
                <CurrencySelect topStart light />
              </div>
              <div className="tf-languages">
                <LanguageSelect
                  parentClassName="image-select center style-default type-languages color-white"
                  topStart
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
