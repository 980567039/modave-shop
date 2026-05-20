import React from "react";

export default function CategoryList() {
  return (
    <div className="list-categories-inner">
      <ul>
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-laptop" />
              Accessories
            </span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item">
                <span className="inner-left">
                  <i className="icon icon-camera" /> Camera &amp; Photo
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item">
                <span className="inner-left">
                  <i className="icon icon-camera" /> Camera &amp; Photo
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item">
                <span className="inner-left">
                  <i className="icon icon-camera" /> Camera &amp; Photo
                </span>
              </a>
            </li>
          </ul>
        </li>
        <li className="sub-categories2">
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-camera" /> Camera &amp; Photo
            </span>
            <i className="icon icon-arrRight" />
          </a>
          <ul className="list-categories-inner">
            <li>
              <a href="#" className="categories-item">
                <span className="inner-left">
                  <i className="icon icon-camera" /> Camera &amp; Photo
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item">
                <span className="inner-left">
                  <i className="icon icon-camera" /> Camera &amp; Photo
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="categories-item">
                <span className="inner-left">
                  <i className="icon icon-camera" /> Camera &amp; Photo
                </span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-smartphone" /> Smart Phones
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-tv" /> TV &amp; Audio
            </span>
            <i className="icon icon-arrRight" />
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-laptop" /> Computer &amp; Laptop
            </span>
            <i className="icon icon-arrRight" />
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-software" /> Software
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-headphones" />
              Headphones
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-audio" /> Home Audio
            </span>
          </a>
        </li>
        <li>
          <a href="#" className="categories-item">
            <span className="inner-left">
              <i className="icon icon-security" /> Security &amp; Surveillance
            </span>
            <i className="icon icon-arrRight" />
          </a>
        </li>
      </ul>
      <div className="box-cate-bottom">
        <ul>
          <li>
            <a href="#" className="categories-item">
              <span className="inner-left"> Accessories</span>
              <i className="icon icon-arrRight" />
            </a>
          </li>
          <li>
            <a href="#" className="categories-item">
              <span className="inner-left"> Camera &amp; Photo</span>
              <i className="icon icon-arrRight" />
            </a>
          </li>
          <li>
            <a href="#" className="categories-item">
              <span className="inner-left"> Smart Phones</span>
              <i className="icon icon-arrRight" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
