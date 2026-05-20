"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import ToolbarBottom from "../headers/ToolbarBottom";
import ScrollTop from "../common/ScrollTop";
import { footerLinks, socialLinks } from "@/app/newSite-data/footerLinks";
import axios from "axios";

const defaultFooterInfo = {
  logo: "/newSite-images/logo/logo.svg",
  logoWhite: "/newSite-images/logo/logo-white.svg",
  brandName: "Modave",
  address: "549 Oak St.Crystal Lake, IL 60014",
  email: "themesflat@gmail.com",
  phone: "315-666-6688",
};

function mapFooterMenus(footerMenus) {
  if (!Array.isArray(footerMenus) || footerMenus.length === 0) {
    return footerLinks;
  }

  return footerMenus
    .filter((section) => section.mainMenuTitle)
    .map((section) => ({
      heading: section.mainMenuTitle,
      items: (section.menuItems || [])
        .filter((item) => item.label && item.url)
        .map((item) => ({
          label: item.label,
          href: item.url,
          isLink: item.url.startsWith("/"),
        })),
    }))
    .filter((section) => section.items.length > 0);
}

function mapSocialLinks(leftContent) {
  const configuredLinks = [
    {
      href: leftContent?.facebook,
      className: "social-facebook",
      iconClass: "icon-fb",
    },
    {
      href: leftContent?.instagram,
      className: "social-instagram",
      iconClass: "icon-instagram",
    },
    {
      href: leftContent?.tiktok,
      className: "social-tiktok",
      iconClass: "icon-tiktok",
    },
    {
      href: leftContent?.whatsapp,
      className: "social-whatsapp",
      iconClass: "icon-whatsapp",
    },
  ].filter((link) => link.href);

  return configuredLinks.length > 0 ? configuredLinks : socialLinks;
}

export default function Footer1({
  border = true,
  dark = false,
  hasPaddingBottom = false,
}) {
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [footerData, setFooterData] = useState(null);
  const leftContent = footerData?.footer?.leftContent || {};
  const storeData = footerData?.storeData || {};
  const footerLogo =
    leftContent.footerLogo ||
    (dark ? defaultFooterInfo.logoWhite : defaultFooterInfo.logo);
  const footerDescription = leftContent.descriptions;
  const footerAddress = storeData.address || defaultFooterInfo.address;
  const footerEmail = leftContent.email || defaultFooterInfo.email;
  const footerPhone = leftContent.phone || defaultFooterInfo.phone;
  const footerMenus = mapFooterMenus(footerData?.footer?.footerMenus);
  const footerSocialLinks = mapSocialLinks(leftContent);
  const brandName = storeData.name || defaultFooterInfo.brandName;

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false); // Set error state
      handleShowMessage();
      e.target.reset(); // Reset the form
    }
  };
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-mobile");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");
      const content = parent.querySelector(".tf-collapse-content");

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount

  useEffect(() => {
    let isMounted = true;

    async function fetchFooterData() {
      try {
        const res = await fetch("/api/site/common");

        if (!res.ok) {
          throw new Error("Failed to fetch footer data");
        }

        const { data } = await res.json();

        if (isMounted) {
          setFooterData(data);
        }
      } catch (error) {
        console.error("Error loading footer data:", error);
      }
    }

    fetchFooterData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <footer
        id="footer"
        className={`footer ${dark ? "bg-main" : ""} ${
          hasPaddingBottom ? "has-pb" : ""
        } `}
      >
        <div className={`footer-wrap ${!border ? "border-0" : ""}`}>
          <div className="footer-body">
            <div className="container">
              <div className="row">
                <div className="col-lg-4">
                  <div className="footer-infor">
                    <div className="footer-logo">
                      <Link href={`/`}>
                        <Image
                          alt=""
                          src={footerLogo}
                          width={127}
                          height={24}
                          style={{ width: "auto", height: "auto" }}
                        />
                      </Link>
                    </div>
                    {footerDescription && (
                      <p className="text-caption-1 mb_20">
                        {footerDescription}
                      </p>
                    )}
                    <div className="footer-address">
                      <p>{footerAddress}</p>
                      <Link
                        href={`/contact`}
                        className={`tf-btn-default fw-6 ${
                          dark ? "style-white" : ""
                        } `}
                      >
                        GET DIRECTION
                        <i className="icon-arrowUpRight" />
                      </Link>
                    </div>
                    <ul className="footer-info">
                      <li>
                        <i className="icon-mail" />
                        <p>{footerEmail}</p>
                      </li>
                      <li>
                        <i className="icon-phone" />
                        <p>{footerPhone}</p>
                      </li>
                    </ul>
                    <ul
                      className={`tf-social-icon  ${
                        dark ? "style-white" : ""
                      } `}
                    >
                      {footerSocialLinks.map((link, index) => (
                        <li key={index}>
                          <a href={link.href} className={link.className}>
                            <i className={`icon ${link.iconClass}`} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="footer-menu">
                    {footerMenus.map((section, sectionIndex) => (
                      <div className="footer-col-block" key={sectionIndex}>
                        <div className="footer-heading text-button footer-heading-mobile">
                          {section.heading}
                        </div>
                        <div className="tf-collapse-content">
                          <ul className="footer-menu-list">
                            {section.items.map((item, itemIndex) => (
                              <li className="text-caption-1" key={itemIndex}>
                                {item.isLink ? (
                                  <Link
                                    href={item.href}
                                    className="footer-menu_item"
                                  >
                                    {item.label}
                                  </Link>
                                ) : (
                                  <a
                                    href={item.href}
                                    className="footer-menu_item"
                                  >
                                    {item.label}
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="footer-col-block">
                    <div className="footer-heading text-button footer-heading-mobile">
                      Newletter
                    </div>
                    <div className="tf-collapse-content">
                      <div className="footer-newsletter">
                        <p className="text-caption-1">
                          Sign up for our newsletter and get 10% off your first
                          purchase
                        </p>
                        <div
                          className={`tfSubscribeMsg  footer-sub-element ${
                            showMessage ? "active" : ""
                          }`}
                        >
                          {success ? (
                            <p style={{ color: "rgb(52, 168, 83)" }}>
                              You have successfully subscribed.
                            </p>
                          ) : (
                            <p style={{ color: "red" }}>Something went wrong</p>
                          )}
                        </div>
                        <form
                          onSubmit={sendEmail}
                          className={`form-newsletter subscribe-form ${
                            dark ? "style-black" : ""
                          }`}
                        >
                          <div className="subscribe-content">
                            <fieldset className="email">
                              <input
                                type="email"
                                name="email"
                                className="subscribe-email"
                                placeholder="Enter your e-mail"
                                tabIndex={0}
                                aria-required="true"
                              />
                            </fieldset>
                            <div className="button-submit">
                              <button
                                className="subscribe-button"
                                type="submit"
                              >
                                <i className="icon icon-arrowUpRight" />
                              </button>
                            </div>
                          </div>
                          <div className="subscribe-msg" />
                        </form>
                        <div className="tf-cart-checkbox">
                          <div className="tf-checkbox-wrapp">
                            <input
                              className=""
                              type="checkbox"
                              id="footer-Form_agree"
                              name="agree_checkbox"
                            />
                            <div>
                              <i className="icon-check" />
                            </div>
                          </div>
                          <label
                            className="text-caption-1"
                            htmlFor="footer-Form_agree"
                          >
                            By clicking subcribe, you agree to the{" "}
                            <Link className="fw-6 link" href={`/term-of-use`}>
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <a className="fw-6 link" href="#">
                              Privacy Policy
                            </a>
                            .
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="footer-bottom-wrap">
                    <div className="left">
                      <p className="text-caption-1">
                        ©{new Date().getFullYear()} {brandName}. All Rights Reserved.
                      </p>
                      <div className="tf-cur justify-content-end">
                        <div className="tf-currencies">
                          <CurrencySelect light={dark ? true : false} />
                        </div>
                        <div className="tf-languages">
                          <LanguageSelect
                            parentClassName={`image-select center style-default type-languages ${
                              dark ? "color-white" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="tf-payment">
                      <p className="text-caption-1">Payment:</p>
                      <ul>
                        <li>
                          <Image
                            alt=""
                            src="/newSite-images/payment/img-1.png"
                            width={100}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt=""
                            src="/newSite-images/payment/img-2.png"
                            width={100}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt=""
                            src="/newSite-images/payment/img-3.png"
                            width={100}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt=""
                            src="/newSite-images/payment/img-4.png"
                            width={98}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt=""
                            src="/newSite-images/payment/img-5.png"
                            width={102}
                            height={64}
                          />
                        </li>
                        <li>
                          <Image
                            alt=""
                            src="/newSite-images/payment/img-6.png"
                            width={98}
                            height={64}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ScrollTop hasPaddingBottom={hasPaddingBottom} />
      <ToolbarBottom />
    </>
  );
}
