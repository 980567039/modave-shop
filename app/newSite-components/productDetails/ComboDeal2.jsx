import React from "react";
import Image from "next/image";
export default function ComboDeal2() {
  return (
    <div className="tf-product-deals">
      <h5 className="mb_16">Combo</h5>
      <div className="tf-product-deals-grid choose-option-list mb_16">
        <div className="tf-product-deals-item style-column choose-option-item">
          <div className="gap-4 d-flex align-items-center flex-column text-center">
            <div className="tf-check-rounded" />
            <div className="text-title">Buy 2 get 10% off per item</div>
          </div>
          <div className="image">
            <Image
              src="/newSite-images/products/baby/product-2.jpg"
              data-=""
              alt=""
              width={450}
              height={450}
            />
          </div>
          <div className="d-flex align-items-center gap-8">
            <div className="tf-product-info-price">
              <div className="price-on-sale text-title">$79.99</div>
              <div className="compare-at-price">$98.99</div>
              <div className="text-btn-uppercase badges-on-sale">-10%</div>
            </div>
          </div>
        </div>
        <div className="tf-product-deals-item style-column choose-option-item">
          <div className="gap-4 d-flex align-items-center flex-column text-center">
            <div className="tf-check-rounded" />
            <div className="text-title">Buy 5 get 15% off per item</div>
          </div>
          <div className="image">
            <Image
              src="/newSite-images/products/baby/product-2.jpg"
              data-=""
              alt=""
              width={450}
              height={450}
            />
          </div>
          <div className="d-flex align-items-center gap-8">
            <div className="tf-product-info-price">
              <div className="price-on-sale text-title">$150.99</div>
              <div className="compare-at-price">$200.99</div>
              <div className="text-btn-uppercase badges-on-sale">-15%</div>
            </div>
          </div>
        </div>
        <div className="tf-product-deals-item style-column choose-option-item select-option">
          <div className="gap-4 d-flex align-items-center flex-column text-center">
            <div className="tf-check-rounded" />
            <div className="text-title">Buy 10 get 25% off per item</div>
          </div>
          <div className="image">
            <Image
              src="/newSite-images/products/baby/product-2.jpg"
              data-=""
              alt=""
              width={450}
              height={450}
            />
          </div>
          <div className="d-flex align-items-center gap-8">
            <div className="tf-product-info-price">
              <div className="price-on-sale text-title">$400.99</div>
              <div className="compare-at-price">$500.99</div>
              <div className="text-btn-uppercase badges-on-sale">-25%</div>
            </div>
          </div>
        </div>
      </div>
      <a href="#" className="btn-style-2 text-btn-uppercase w-100">
        Choose This Deal
      </a>
    </div>
  );
}
