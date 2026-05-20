"use client";
import React from "react";
import CountdownTimer from "../common/Countdown";

export default function CommingSoon() {
  return (
    <section className="flat-spacing coming-soon">
      <div className="coming-soon-inner">
        <div className="content">
          <div className="heading title-display">Coming Soon</div>
          <div className="tf-countdown-lg">
            <div
              className="js-countdown"
              data-timer={1007500}
              data-labels="DAYS,HOURS,MINUTES,SECONDS"
            >
              <CountdownTimer style={3} />
            </div>
          </div>
          <form
            className="form-newsletter subscribe-form type-coming-soon"
            id="subscribe-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div id="subscribe-content" className="subscribe-content">
              <fieldset className="email">
                <input
                  type="email"
                  name="email-form"
                  id="subscribe-email"
                  className="subscribe-email"
                  placeholder="Enter your e-mail"
                  tabIndex={0}
                  aria-required="true"
                />
              </fieldset>
              <div className="button-submit">
                <button
                  className="subscribe-button"
                  type="button"
                  id="subscribe-button"
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div id="subscribe-msg" className="subscribe-msg" />
          </form>
          <ul className="tf-social-icon style-default style-white justify-content-center">
            <li>
              <a href="#" className="social-facebook">
                <i className="icon icon-fb" />
              </a>
            </li>
            <li>
              <a href="#" className="social-twiter">
                <i className="icon icon-x" />
              </a>
            </li>
            <li>
              <a href="#" className="social-instagram">
                <i className="icon icon-instagram" />
              </a>
            </li>
            <li>
              <a href="#" className="social-tiktok">
                <i className="icon icon-tiktok" />
              </a>
            </li>
            <li>
              <a href="#" className="social-amazon">
                <i className="icon icon-amazon" />
              </a>
            </li>
            <li>
              <a href="#" className="social-pinterest">
                <i className="icon icon-pinterest" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
