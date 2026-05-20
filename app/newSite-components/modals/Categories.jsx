"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const fallbackImage = "/newSite-images/collections/collection-circle/cls-circle1.jpg";

function getCategoryTitle(category) {
  return category.customCategoryTitle || category.title || "Category";
}

function getCategoryImage(category) {
  return category.categoryImage?.url || category.image?.url || fallbackImage;
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/site/categories?page=1&limit=20");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const { data } = await res.json();

        if (isMounted) {
          setCategories(Array.isArray(data) ? data.filter((item) => item.slug) : []);
        }
      } catch (error) {
        console.error("Error loading storefront categories:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="offcanvas offcanvas-start canvas-filter canvas-categories"
      id="shopCategories"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <span className="icon-left icon-filter" />
          <h5>Categories</h5>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body">
          <div className="wd-facet-categories">
            <Link
              href="/shop-default-grid"
              className="facet-title"
              data-bs-dismiss="offcanvas"
            >
              <Image
                className="avt"
                alt="All Products"
                src={fallbackImage}
                width={48}
                height={48}
              />
              <span className="title">All Products</span>
              <span className="icon icon-arrow-right" />
            </Link>
          </div>

          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div className="wd-facet-categories" key={index}>
                  <div className="facet-title">
                    <span
                      className="avt"
                      style={{ backgroundColor: "#f0f0f0", borderRadius: "50%" }}
                    />
                    <span className="title">Loading...</span>
                  </div>
                </div>
              ))
            : categories.map((category) => {
                const title = getCategoryTitle(category);

                return (
                  <div className="wd-facet-categories" key={category._id || category.slug}>
                    <Link
                      href={`/shop-default-grid?category=${encodeURIComponent(category.slug)}`}
                      className="facet-title"
                      data-bs-dismiss="offcanvas"
                    >
                      <Image
                        className="avt"
                        alt={title}
                        src={getCategoryImage(category)}
                        width={48}
                        height={48}
                      />
                      <span className="title">{title}</span>
                      <span className="text-caption-1 text-secondary">
                        {category.productCount || 0} items
                      </span>
                    </Link>
                  </div>
                );
              })}

          {!loading && categories.length === 0 ? (
            <div className="p-4 text-secondary">No categories available.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
