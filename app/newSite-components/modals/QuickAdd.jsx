"use client";
import { useContextElement } from "@/app/newSite-context/Context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ColorSelect from "../productDetails/ColorSelect";
import SizeSelect from "../productDetails/SizeSelect";
import QuantitySelect from "../productDetails/QuantitySelect";
export default function QuickAdd() {
  const [quantity, setQuantity] = useState(1);
  const {
    quickAddItem,
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    addToWishlist,
    isAddedtoWishlist,
    isAddedtoCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();
  const [item, setItem] = useState(null);
  useEffect(() => {
    setItem(quickAddItem);
  }, [quickAddItem]);

  if (!item) return null;

  const itemId = item._id || item.id;
  const itemImage =
    item.defaultImage?.url || item.imgSrc || item.image || item.mainImage;
  const itemPrice = Number(item.price) || 0;
  const itemOldPrice = Number(item.oldPrice || item.salePrice) || 0;
  const cartItem = cartProducts.find(
    (product) => (product.productId || product._id || product.id) == itemId
  );

  return (
    <div className="modal fade modal-quick-add" id="quickAdd">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div>
            <div className="tf-product-info-list">
              <div className="tf-product-info-item">
                <div className="image">
                  <Image alt="" src={itemImage} width={600} height={800} />
                </div>
                <div className="content">
                  <Link href={`/product-detail/${itemId}`}>{item.title}</Link>
                  <div className="tf-product-info-price">
                    <h5 className="price-on-sale font-2">
                      ${itemPrice.toFixed(2)}
                    </h5>
                    {itemOldPrice ? (
                      <>
                        <div className="compare-at-price font-2">
                          ${itemOldPrice.toFixed(2)}
                        </div>
                        <div className="badges-on-sale text-btn-uppercase">
                          -25%
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="tf-product-info-choose-option">
                <ColorSelect />
                <SizeSelect />
                <div className="tf-product-info-quantity">
                  <div className="title mb_12">Quantity:</div>
                  <QuantitySelect
                    quantity={cartItem ? cartItem.quantity : quantity}
                    setQuantity={(qty) => {
                      if (isAddedToCartProducts(itemId)) {
                        updateQuantity(itemId, qty);
                      } else {
                        setQuantity(qty);
                      }
                    }}
                  />
                </div>
                <div>
                  <div className="tf-product-info-by-btn mb_10">
                    <a
                      className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 show-shopping-cart"
                      onClick={() => addProductToCart(item, quantity)}
                    >
                      <span>
                        {isAddedToCartProducts(itemId)
                          ? "Already Added"
                          : "Add to cart -"}
                        &nbsp;
                      </span>
                      <span className="tf-qty-price total-price">
                        $
                        {cartItem
                          ? (itemPrice * cartItem.quantity).toFixed(2)
                          : (itemPrice * quantity).toFixed(2)}
                      </span>
                    </a>
                    <a
                      href="#compare"
                      onClick={() => addToCompareItem(item)}
                      data-bs-toggle="offcanvas"
                      aria-controls="compare"
                      className="box-icon hover-tooltip compare btn-icon-action show-compare"
                    >
                      <span className="icon icon-gitDiff" />
                      <span className="tooltip text-caption-2">
                        {" "}
                        {isAddedtoCompareItem(itemId)
                          ? "Already compared"
                          : "Compare"}
                      </span>
                    </a>
                    <a
                      onClick={() => addToWishlist(item)}
                      className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                    >
                      <span className="icon icon-heart" />
                      <span className="tooltip text-caption-2">
                        {isAddedtoWishlist(itemId)
                          ? "Already Wishlished"
                          : "Wishlist"}
                      </span>
                    </a>
                  </div>
                  <a href="#" className="btn-style-3 text-btn-uppercase">
                    Buy it now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
