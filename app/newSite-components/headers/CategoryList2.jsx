import React from "react";

export default function CategoryList2() {
  return (
    <div className="list-categories-inner">
      <ul className="text-title">
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">Book</span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Book</span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Book</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">Fiction</span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Fiction</span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Fiction</span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">Nonfiction</span>
          </a>
        </li>
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">eBooks</span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">eBooks</span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">eBooks</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">Audiobooks</span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Audiobooks</span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Audiobooks</span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">Teens &amp; YA</span>
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">Kids</span>
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">Toys &amp; Games</span>
          </a>
        </li>
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">Music &amp; Movies</span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Music &amp; Movies</span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item text-title">
                <span className="inner-left">Music &amp; Movies</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
