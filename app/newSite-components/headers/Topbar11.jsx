import React from "react";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";

export default function Topbar11() {
  return (
    <div className="tf-topbar style-2 topbar-fullwidth-2 bg-black">
      <div className="row align-items-center">
        <div className="col-sm-6 d-none d-sm-block">
          <ul className="d-flex align-items-center gap-20">
            <li>
              <a
                href="tel:3156666688"
                className="link text-white text-caption-1"
              >
                315-666-6688
              </a>
            </li>
            <li>
              <a
                href="mailto:hi.avitex@gmail.com"
                className="link text-white text-caption-1"
              >
                hi.avitex@gmail.com
              </a>
            </li>
          </ul>
        </div>
        <div className="col-sm-6 col-12">
          <div className="tf-cur justify-content-center justify-content-sm-end">
            <p className="text-white text-caption-1 d-none d-md-block">
              Order Tracking
            </p>
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
  );
}
