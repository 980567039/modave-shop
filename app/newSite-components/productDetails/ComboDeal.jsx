"use client";
import React, { useState } from "react";

const deals = [
  {
    id: "deal-1",
    title: "Buy 2 get 10% off per item",
    total: "$79.99",
    comparePrice: "$98.99",
    discount: "-10%",
  },
  {
    id: "deal-2",
    title: "Buy 5 get 15% off per item",
    total: "$150.99",
    comparePrice: "$200.99",
    discount: "-15%",
  },
  {
    id: "deal-3",
    title: "Buy 10 get 25% off per item",
    total: "$400.99",
    comparePrice: "$500.99",
    discount: "-25%",
  },
];

const ComboDeal = () => {
  const [selectedDeal, setSelectedDeal] = useState(null); // State to track the selected deal

  const handleDealClick = (id) => {
    setSelectedDeal(id); // Set the selected deal when clicked
  };

  return (
    <div className="tf-product-deals">
      <h5 className="mb_16">Combo</h5>
      <div className="tf-product-deals-list choose-option-list mb_16">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className={`tf-product-deals-item choose-option-item ${
              selectedDeal === deal.id ? "select-option" : ""
            }`}
            onClick={() => handleDealClick(deal.id)} // Set selected deal on click
          >
            <div className="text-tile">{deal.title}</div>
            <div className="d-flex align-items-center gap-8">
              <div className="text-title">Total</div>
              <div className="tf-product-info-price">
                <div className="price-on-sale text-title">{deal.total}</div>
                <div className="compare-at-price">{deal.comparePrice}</div>
                <div className="text-btn-uppercase badges-on-sale">
                  {deal.discount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a href="#" className="btn-style-2 text-btn-uppercase w-100">
        Choose This Deal
      </a>
    </div>
  );
};

export default ComboDeal;
