"use client";

import { useStorefrontNavigation } from "./useStorefrontNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Nav() {
  const pathname = usePathname();
  const storefrontNavigation = useStorefrontNavigation();

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
                  {item.name}
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
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <Link href={item.href} className="item-link">
                {item.name}
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
}
