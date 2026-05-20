"use client";

import { storefrontNavigation } from "@/app/newSite-data/menu";
import { useEffect, useMemo, useState } from "react";

const categoryFallback = {
  href: "/shop-default-grid",
  name: "All Products",
};

function mapCategoryToNavigationItem(category) {
  return {
    href: `/shop-default-grid?category=${encodeURIComponent(category.slug)}`,
    name: category.customCategoryTitle || category.title,
    active: false,
  };
}

export function useStorefrontNavigation() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const res = await fetch("/api/site/categories?page=1&limit=8");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const { data } = await res.json();

        if (isMounted) {
          setCategories(
            Array.isArray(data)
              ? data.filter((category) => category.slug && category.title)
              : []
          );
        }
      } catch (error) {
        console.error("Error loading navigation categories:", error);
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () =>
      storefrontNavigation.map((item) => {
        if (item.key !== "categories") {
          return item;
        }

        const categoryChildren = categories.map(mapCategoryToNavigationItem);

        return {
          ...item,
          children:
            categoryChildren.length > 0
              ? [categoryFallback, ...categoryChildren]
              : item.children,
        };
      }),
    [categories]
  );
}
