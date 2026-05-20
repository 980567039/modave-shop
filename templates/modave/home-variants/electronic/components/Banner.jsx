import React from "react";
import Link from "next/link";

export default function Banner({ data = {} }) {
  const {
    title = "Supper Sale:",
    code = "K82FS8",
    discount = "-20% Discount for first purchse",
    buttonText = "Discover More",
    buttonLink = "/shop-default-grid",
  } = data;

  return (
    <section>
      <div className="container">
        <div className="banner-supper-sale">
          <h6>{title}</h6>
          <div className="code-sale">{code}</div>
          <div className="body-text-1">{discount}</div>
          <Link href={buttonLink} className="tf-btn btn-fill">
            <span className="text text-button">{buttonText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
