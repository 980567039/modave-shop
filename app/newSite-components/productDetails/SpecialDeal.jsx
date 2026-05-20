import Link from "next/link";
import React from "react";
import Image from "next/image";
export default function SpecialDeal() {
  return (
    <div className="tf-product-deals">
      <h5 className="mb_16">Special Deal</h5>
      <div className="tf-buyx-gety-wrap mb_16">
        <div className="tf-buyx-gety-item">
          <div className="image">
            <Image
              src="/newSite-images/products/baby/product-2.jpg"
              data-=""
              alt=""
              width={450}
              height={450}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between flex-grow-1">
            <a href={"/"} className="text-title title link">
              Neat Solutions Infant Boy...
            </a>
            <div className="d-flex align-items-center gap-4 text-button">
              <span>1</span>
              <span>X</span>
              <span>$9.99</span>
            </div>
          </div>
          <div className="text-btn-uppercase tags text-white">Buy 1</div>
        </div>
        <div className="tf-buyx-gety-deviced">
          <span>
            <svg
              width={40}
              height={40}
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.5 0C16.5444 0 12.6776 1.17298 9.3886 3.37061C6.09962 5.56823 3.53617 8.69181 2.02242 12.3463C0.508666 16.0008 0.112599 20.0222 0.884303 23.9018C1.65601 27.7814 3.56082 31.3451 6.35787 34.1421C9.15492 36.9392 12.7186 38.844 16.5982 39.6157C20.4778 40.3874 24.4991 39.9913 28.1537 38.4776C31.8082 36.9638 34.9318 34.4004 37.1294 31.1114C39.327 27.8224 40.5 23.9556 40.5 20C40.4934 14.6977 38.3841 9.61446 34.6348 5.86517C30.8855 2.11588 25.8023 0.00661548 20.5 0ZM28.1923 21.5385H22.0385V27.6923C22.0385 28.1003 21.8764 28.4916 21.5879 28.7802C21.2993 29.0687 20.908 29.2308 20.5 29.2308C20.092 29.2308 19.7007 29.0687 19.4121 28.7802C19.1236 28.4916 18.9615 28.1003 18.9615 27.6923V21.5385H12.8077C12.3997 21.5385 12.0084 21.3764 11.7198 21.0879C11.4313 20.7993 11.2692 20.408 11.2692 20C11.2692 19.592 11.4313 19.2007 11.7198 18.9121C12.0084 18.6236 12.3997 18.4615 12.8077 18.4615H18.9615V12.3077C18.9615 11.8997 19.1236 11.5084 19.4121 11.2198C19.7007 10.9313 20.092 10.7692 20.5 10.7692C20.908 10.7692 21.2993 10.9313 21.5879 11.2198C21.8764 11.5084 22.0385 11.8997 22.0385 12.3077V18.4615H28.1923C28.6003 18.4615 28.9917 18.6236 29.2802 18.9121C29.5687 19.2007 29.7308 19.592 29.7308 20C29.7308 20.408 29.5687 20.7993 29.2802 21.0879C28.9917 21.3764 28.6003 21.5385 28.1923 21.5385Z"
                fill="#181818"
              />
            </svg>
          </span>
        </div>
        <div className="tf-buyx-gety-item">
          <div className="image">
            <Image
              src="/newSite-images/products/baby/product-3.jpg"
              data-=""
              alt=""
              width={450}
              height={450}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between flex-grow-1">
            <a href={"/"} className="text-title title link">
              Frigg Moon Natural Rubber...
            </a>
            <div className="d-flex align-items-center gap-4 text-button">
              <span>1</span>
              <span>X</span>
              <span>$6.99</span>
            </div>
          </div>
          <div className="text-btn-uppercase tags text-white">
            Get 1 Off 10%
          </div>
        </div>
      </div>
      <a href="#" className="btn-style-2 text-btn-uppercase w-100">
        Choose This Deal
      </a>
    </div>
  );
}
