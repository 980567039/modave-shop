import React from "react";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";
import CurrencySelect from "../common/CurrencySelect";
import LanguageSelect from "../common/LanguageSelect";
import CartLength from "../common/CartLength";
export default function Header4() {
  return (
    <header id="header" className="header-default header-style-4">
      <div className="main-header">
        <div className="container">
          <div className="row wrapper-header align-items-center">
            <div className="col-xl-5 d-none d-xl-block">
              <div className="wrapper-header-left d-flex align-items-center gap-20">
                <div className="tf-currencies">
                  <CurrencySelect topStart />
                </div>
                <div className="tf-languages">
                  <LanguageSelect
                    topStart
                    parentClassName="image-select center style-default type-languages"
                  />
                </div>
                <Link
                  href={`/store-list`}
                  className="text-decoration-underline text-caption-1"
                >
                  Our Store
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-3 d-xl-none">
              <a
                href="newSite#mobileMenu"
                className="mobile-menu"
                data-bs-toggle="offcanvas"
                aria-controls="mobileMenu"
              >
                <i className="icon icon-categories" />
              </a>
            </div>
            <div className="col-xl-2 col-md-4 col-6 text-center">
              <Link href={`/newSite`} className="logo-header">
                <Image
                  alt="logo"
                  className="logo"
                  src="/newSite-images/logo/logo.svg"
                  width={144}
                  height={25}
                />
              </Link>
            </div>
            <div className="col-xl-5 col-md-4 col-3">
              <ul className="nav-icon d-flex justify-content-end align-items-center">
                <li className="nav-search">
                  <a
                    href="#search"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <span className="icon icon-search2" />
                  </a>
                </li>
                <li className="nav-account">
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <span className="icon icon-user" />
                  </a>
                  <div className="dropdown-account dropdown-login">
                    <div className="sub-top">
                      <Link href={`/login`} className="tf-btn btn-reset">
                        Login
                      </Link>
                      <p className="text-center text-secondary-2">
                        Don’t have an account?{" "}
                        <Link href={`/register`}>Register</Link>
                      </p>
                    </div>
                    <div className="sub-bot">
                      <span className="body-text-">Support</span>
                    </div>
                  </div>
                </li>
                {/* <li className="nav-wishlist">
                  <Link href={`/wish-list`} className="nav-icon-item">
                    <span className="icon icon-heart" />
                  </Link>
                </li> */}
                <li className="nav-cart">
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <span className="icon icon-ShoppingBagOpen" />
                    <span className="count-box">
                      <CartLength />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="header-bottom d-none d-xl-block header-dark">
        <div className="container">
          <div className="wrapper-header d-flex justify-content-center align-items-center">
            <nav className="box-navigation text-center">
              <ul className="box-nav-ul d-flex align-items-center justify-content-center d-none d-xl-flex">
                <Nav />
              </ul>
              <ul className="header-list-categories d-xl-none justify-content-center">
                <li className="categories-item active">
                  <Link href={`/home-fashion-main`} className="text-uppercase">
                    Women
                  </Link>
                </li>
                <li className="categories-item">
                  <Link href={`/home-fashion-men`} className="text-uppercase">
                    Men
                  </Link>
                </li>
                <li className="categories-item">
                  <Link href={`/home-fashion-kid`} className="text-uppercase">
                    Kids
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
