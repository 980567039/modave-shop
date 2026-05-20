"use client";

import { useStorefrontNavigation } from "../headers/useStorefrontNavigation";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";

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

export default function MobileMenu() {
  const pathname = usePathname();
  const storefrontNavigation = useStorefrontNavigation();

  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          <div className="mb-content-top">
            <form className="form-search" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="text">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className=""
                  name="text"
                  tabIndex={0}
                  defaultValue=""
                  aria-required="true"
                  required
                />
              </fieldset>
              <button className="" type="submit">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#181818"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.9984 20.9999L16.6484 16.6499"
                    stroke="#181818"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
            <ul className="nav-ul-mb" id="wrapper-menu-navigation">
              {storefrontNavigation.map((item, index) => {
                const hasChildren = item.children?.length > 0;
                const collapseId = `mobile-menu-${index}`;

                return (
                  <li
                    key={`${item.name}-${item.href}`}
                    className={`nav-mb-item ${
                      isActiveItem(pathname, item) ? "active" : ""
                    }`}
                  >
                    {hasChildren ? (
                      <>
                        <a
                          href={`#${collapseId}`}
                          className={`collapsed mb-menu-link ${
                            isActiveItem(pathname, item) ? "active" : ""
                          }`}
                          data-bs-toggle="collapse"
                          aria-expanded="false"
                          aria-controls={collapseId}
                        >
                          <span>{item.name}</span>
                          <span className="btn-open-sub" />
                        </a>
                        <div id={collapseId} className="collapse">
                          <ul className="sub-nav-menu">
                            {item.children.map((child) => (
                              <li key={`${child.name}-${child.href}`}>
                                <Link
                                  href={child.href}
                                  className={`sub-nav-link ${
                                    isActiveLink(pathname, child)
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`mb-menu-link ${
                          isActiveLink(pathname, item) ? "active" : ""
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mb-other-content">
            <div className="group-icon">
              <Link href={`/shopping-cart`} className="site-nav-icon">
                <svg
                  className="icon"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5078 10.8734V6.36686C16.5078 5.17166 16.033 4.02541 15.1879 3.18028C14.3428 2.33514 13.1965 1.86035 12.0013 1.86035C10.8061 1.86035 9.65985 2.33514 8.81472 3.18028C7.96958 4.02541 7.49479 5.17166 7.49479 6.36686V10.8734M4.11491 8.62012H19.8877L21.0143 22.1396H2.98828L4.11491 8.62012Z"
                    stroke="#181818"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Cart
              </Link>
              <Link href={`/login`} className="site-nav-icon">
                <svg
                  className="icon"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#181818"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#181818"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Login
              </Link>
            </div>
            <div className="mb-notice">
              <Link href={`/contact`} className="text-need">
                Need Help?
              </Link>
            </div>
            <div className="mb-contact">
              <p className="text-caption-1">
                549 Oak St.Crystal Lake, IL 60014
              </p>
              <Link
                href={`/contact`}
                className="tf-btn-default text-btn-uppercase"
              >
                GET DIRECTION
                <i className="icon-arrowUpRight" />
              </Link>
            </div>
            <ul className="mb-info">
              <li>
                <i className="icon icon-mail" />
                <p>themesflat@gmail.com</p>
              </li>
              <li>
                <i className="icon icon-phone" />
                <p>315-666-6688</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-bottom">
          <div className="bottom-bar-language">
            <div className="tf-currencies">
              <CurrencySelect />
            </div>
            <div className="tf-languages">
              <LanguageSelect parentClassName="image-select center style-default type-languages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
