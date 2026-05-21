"use client";

import { useStorefrontNavigation } from "./useStorefrontNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const getPathKey = (href) => href.split("?")[0].split("#")[0];

const isActiveLink = (pathname, item) => {
  if (item.active === false) {
    return false;
  }

  const href = getPathKey(item.href);

  if (href === "/") {
    return pathname === "/";
  }

  if (!href.startsWith("/")) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const isActiveItem = (pathname, item) => {
  if (isActiveLink(pathname, item)) {
    return true;
  }

  return item.children?.some((child) => isActiveLink(pathname, child));
};

const navTranslationKeys = {
  Home: "home",
  Shop: "shop",
  Categories: "categories",
  "Customer Care": "customerCare",
  About: "about",
  Contact: "contact",
  "All Products": "allProducts",
  Search: "search",
  Cart: "cart",
  Checkout: "checkout",
  FAQs: "faqs",
  "Order Tracking": "orderTracking",
  "Terms of Use": "termsOfUse",
  "Customer Feedback": "customerFeedback",
  "Store List": "storeList",
};

export default function Nav() {
  const pathname = usePathname();
  const storefrontNavigation = useStorefrontNavigation();
  const t = useTranslations("nav");
  const getLabel = (item) => {
    const translationKey = navTranslationKeys[item.name];
    return translationKey ? t(translationKey) : item.name;
  };

  return (
    <>
      {storefrontNavigation.map((item) => {
        const hasChildren = item.children?.length > 0;

        return (
          <li
            key={`${item.name}-${item.href}`}
            className={`menu-item ${hasChildren ? "position-relative" : ""} ${
              isActiveItem(pathname, item) ? "active" : ""
            }`}
          >
            {hasChildren ? (
              <>
                <a href="#" className="item-link">
                  {getLabel(item)}
                  <i className="icon icon-arrow-down" />
                </a>
                <div className="sub-menu submenu-default">
                  <ul className="menu-list">
                    {item.children.map((child) => (
                      <li
                        key={`${child.name}-${child.href}`}
                        className={`menu-item-li ${
                          isActiveLink(pathname, child) ? "active" : ""
                        }`}
                      >
                        <Link href={child.href} className="menu-link-text">
                          {getLabel(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <Link href={item.href} className="item-link">
                {getLabel(item)}
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
}
