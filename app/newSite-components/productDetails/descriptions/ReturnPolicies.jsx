import React from "react";

export default function ReturnPolicies() {
  return (
    <>
      {" "}
      <div className="text-btn-uppercase mb_12">Return Policies</div>
      <p className="mb_12 text-secondary">
        At Modave, we stand behind the quality of our products. If you're not
        completely satisfied with your purchase, we offer hassle-free returns
        within 30 days of delivery.
      </p>
      <div className="text-btn-uppercase mb_12">Easy Exchanges or Refunds</div>
      <ul className="list-text type-disc mb_12 gap-6">
        <li className="text-secondary font-2">
          Exchange your item for a different size, color, or style, or receive a
          full refund.
        </li>
        <li className="text-secondary font-2">
          All returned items must be unworn, in their original packaging, and
          with tags attached.
        </li>
      </ul>
      <div className="text-btn-uppercase mb_12">Simple Process</div>
      <ul className="list-text type-number">
        <li className="text-secondary font-2">
          Initiate your return online or contact our customer service team for
          assistance.
        </li>
        <li className="text-secondary font-2">
          Pack your item securely and include the original packing slip.
        </li>
        <li className="text-secondary font-2">
          Ship your return back to us using our prepaid shipping label.
        </li>
        <li className="text-secondary font-2">
          Once received, your refund will be processed promptly.
        </li>
      </ul>
      <p className="text-secondary font-2">
        For any questions or concerns regarding returns, don't hesitate to reach
        out to our dedicated customer service team. Your satisfaction is our
        priority.
      </p>
    </>
  );
}
