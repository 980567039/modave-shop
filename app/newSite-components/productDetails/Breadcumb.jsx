"use client";
import React from "react";
import Link from "next/link";
export default function Breadcumb({ product }) {
  const category = product.category?.[0];
  const categoryTitle = category?.customCategoryTitle || category?.title;
  const categorySlug = category?.slug;

  return (
    <div className="tf-breadcrumb">
      <div className="container">
        <div className="tf-breadcrumb-wrap">
          <div className="tf-breadcrumb-list">
            <Link href="/" className="text text-caption-1">
              Homepage
            </Link>
            <i className="icon icon-arrRight" />
            <Link href="/shop-default-grid" className="text text-caption-1">
              Shop
            </Link>
            {categoryTitle ? (
              <>
                <i className="icon icon-arrRight" />
                <Link
                  href={
                    categorySlug
                      ? `/shop-default-grid?category=${encodeURIComponent(categorySlug)}`
                      : "/shop-default-grid"
                  }
                  className="text text-caption-1"
                >
                  {categoryTitle}
                </Link>
              </>
            ) : null}
            <i className="icon icon-arrRight" />
            <span className="text text-caption-1">{product.title}</span>
          </div>
          <div className="tf-breadcrumb-prev-next">
            <Link href="/shop-default-grid" className="tf-breadcrumb-prev">
              <i className="icon icon-arrLeft" />
            </Link>
            <Link href="/shop-default-grid" className="tf-breadcrumb-back">
              <i className="icon icon-squares-four" />
            </Link>
            <Link href="/shop-default-grid" className="tf-breadcrumb-next">
              <i className="icon icon-arrRight" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
