import React from "react";
import Description from "./Description";
import Reviews from "./Reviews";
import Shipping from "./Shipping";
import ReturnPolicies from "./ReturnPolicies";

export default function DescriptionAccrdion() {
  return (
    <section className="">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className="accordion-product-wrap" id="accordion-product">
              <li className="accordion-product-item">
                <a
                  href="#accordion-1"
                  className="accordion-title collapsed current"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordion-1"
                >
                  <h6>Description</h6>
                  <span className="btn-open-sub" />
                </a>
                <div
                  id="accordion-1"
                  className="collapse"
                  data-bs-parent="#accordion-product"
                >
                  <div className="accordion-content tab-description">
                    <Description />
                  </div>
                </div>
              </li>
              <li className="accordion-product-item">
                <a
                  href="#accordion-2"
                  className="accordion-title current"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordion-2"
                >
                  <h6>Customer Reviews</h6>
                  <span className="btn-open-sub" />
                </a>
                <div
                  id="accordion-2"
                  className="collapse show"
                  data-bs-parent="#accordion-product"
                >
                  <div className="accordion-content tab-reviews write-cancel-review-wrap">
                    <Reviews />
                  </div>
                </div>
              </li>
              <li className="accordion-product-item">
                <a
                  href="#accordion-3"
                  className="accordion-title collapsed current"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordion-3"
                >
                  <h6>Shipping &amp; Returns</h6>
                  <span className="btn-open-sub" />
                </a>
                <div
                  id="accordion-3"
                  className="collapse"
                  data-bs-parent="#accordion-product"
                >
                  <div className="accordion-content tab-shipping">
                    <Shipping />
                  </div>
                </div>
              </li>
              <li className="accordion-product-item">
                <a
                  href="#accordion-4"
                  className="accordion-title collapsed current"
                  data-bs-toggle="collapse"
                  aria-expanded="true"
                  aria-controls="accordion-4"
                >
                  <h6>Return Policies</h6>
                  <span className="btn-open-sub" />
                </a>
                <div
                  id="accordion-4"
                  className="collapse"
                  data-bs-parent="#accordion-product"
                >
                  <div className="accordion-content tab-policies">
                    <ReturnPolicies />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
