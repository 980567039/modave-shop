import React from "react";

import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import CategoryList2 from "./CategoryList2";

export default function Header14() {
  return (
    <header
      id="header"
      className="header-default header-absolute header-style-6"
    >
      <div className="container-full2">
        <div className="row wrapper-header align-items-center">
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
          <div className="col-xl-9 col-md-4 col-6">
            <div className="header-left justify-content-xl-start justify-content-center">
              <Link href={`/newSite`} className="logo-header">
                <Image
                  alt="logo"
                  className="logo"
                  src="/newSite-images/logo/logo.svg"
                  width={144}
                  height={25}
                />
              </Link>
              <div className="tf-list-categories style-2 d-none d-xl-block">
                <a href="#" className="categories-title text-title">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_19494_2169)">
                      <path
                        d="M9.75 3.75H5.25C4.83579 3.75 4.5 4.08579 4.5 4.5V19.5C4.5 19.9142 4.83579 20.25 5.25 20.25H9.75C10.1642 20.25 10.5 19.9142 10.5 19.5V4.5C10.5 4.08579 10.1642 3.75 9.75 3.75Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.4065 19.2907L16.018 20.2282C15.9213 20.2488 15.8215 20.25 15.7242 20.2318C15.627 20.2137 15.5344 20.1765 15.4516 20.1224C15.3688 20.0683 15.2976 19.9983 15.2419 19.9166C15.1863 19.8348 15.1474 19.7428 15.1274 19.646L12.0168 4.85599C11.9749 4.66061 12.0121 4.45662 12.1201 4.28853C12.2281 4.12044 12.3982 4.00191 12.5933 3.9588L16.9818 3.0213C17.0785 3.00072 17.1784 2.99948 17.2756 3.01764C17.3728 3.03579 17.4654 3.073 17.5482 3.12711C17.631 3.18122 17.7022 3.25116 17.7579 3.33292C17.8135 3.41468 17.8524 3.50663 17.8724 3.60349L20.983 18.3935C21.0249 18.5889 20.9877 18.7929 20.8797 18.9609C20.7717 19.129 20.6016 19.2476 20.4065 19.2907Z"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.5 6.75H10.5"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.5 17.25H10.5"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.4844 7.07648L18.3391 5.81836"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.1094 10.0355L18.965 8.77734"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.6641 17.432L20.5187 16.1738"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_19494_2169">
                        <rect width={24} height={24} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="d-none d-xxl-block">Browse by Category</span>
                  <span className="icon icon-arrow-down" />
                </a>
                <CategoryList2 />
              </div>
              <nav className="box-navigation text-center d-none d-xl-block">
                <ul className="box-nav-ul d-flex align-items-center justify-content-center">
                  <Nav />
                </ul>
              </nav>
            </div>
          </div>
          <div className="col-xl-3 col-md-4 col-3">
            <div className="header-right">
              <form className="form-search d-xl-flex d-none position-relative">
                <fieldset className="text w-100">
                  <input
                    type="text"
                    placeholder="Search Products"
                    className="style-line-bottom"
                    name="text"
                    tabIndex={0}
                    defaultValue=""
                    aria-required="true"
                    required=""
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
                    <g clipPath="url(#clip0_19494_2214)">
                      <path
                        d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
                        stroke="#181818"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.8047 15.8037L21.0012 21.0003"
                        stroke="#181818"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_19494_2214">
                        <rect width={24} height={24} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </form>
              <ul className="nav-icon d-flex justify-content-end align-items-center">
                <li className="nav-search d-xl-none d-flex">
                  <a
                    href="#search"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <svg
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                        stroke="#181818"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21.35 21.0004L17 16.6504"
                        stroke="#181818"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
                <li className="nav-account">
                  <a href="#" className="nav-icon-item">
                    <svg
                      className="icon"
                      width={24}
                      height={24}
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
                  </a>
                  <div className="dropdown-account dropdown-login">
                    <div className="sub-top">
                      <Link href={`/login`} className="tf-btn btn-reset">
                        Login
                      </Link>
                      <p className="text-center text-secondary-2">
                        Don’t have an account?
                        <Link href={`/register`}>Register</Link>
                      </p>
                    </div>
                    <div className="sub-bot">
                      <span className="body-text-">Support</span>
                    </div>
                  </div>
                </li>
                <li className="nav-wishlist">
                  <Link href={`/wish-list`} className="nav-icon-item">
                    <svg
                      className="icon"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z"
                        stroke="#181818"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </li>
                <li className="nav-cart">
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <svg
                      className="icon"
                      width={24}
                      height={24}
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
                    <span className="count-box bg-dark">1</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
