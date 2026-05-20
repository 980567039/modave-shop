import Link from "next/link";
import React from "react";
import Image from "next/image";
export default function Blogs({ blogs = [] }) {
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section">
          <h3 className="heading wow fadeInUp">News insight</h3>
          <p className="subheading wow fadeInUp">
            Browse our Top Trending: the hottest picks loved by all.
          </p>
        </div>
        <div className="grid-cls-v3">
          {blogs.map((item) => (
            <div key={item.id} className={item.className} data-wow-delay="0s">
              <div className="image">
                <Image
                  className="lazyload"
                  data-src={item.imageSrc}
                  alt=""
                  src={item.imageSrc}
                  width={320}
                  height={240}
                />
              </div>
              <div className="content">
                <ul className="meta-list">
                  <li>
                    <i className="icon-calendar" />
                    <p className="text-caption-1">{item.date}</p>
                  </li>
                  <li className="br-line type-vertical bg-line d-none d-sm-block" />
                  <li>
                    <i className="icon-user" />
                    <p className="text-caption-1">{item.author}</p>
                  </li>
                </ul>
                <h5 className="title">
                  <Link className="link" href={`/blog-detail/${item.id}`}>
                    {item.title}
                  </Link>
                </h5>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
          <div className="item3">
            <div className="contact-wrap-form style-2 bg-brown-2 text-center">
              <div className="box-title">
                <div className="icon">
                  <svg
                    width={100}
                    height={100}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.8438 59.375C39.8438 59.9966 39.5968 60.5927 39.1573 61.0323C38.7177 61.4718 38.1216 61.7188 37.5 61.7188H21.875C21.2534 61.7188 20.6573 61.4718 20.2177 61.0323C19.7782 60.5927 19.5312 59.9966 19.5312 59.375C19.5312 58.7534 19.7782 58.1573 20.2177 57.7177C20.6573 57.2782 21.2534 57.0312 21.875 57.0312H37.5C38.1216 57.0312 38.7177 57.2782 39.1573 57.7177C39.5968 58.1573 39.8438 58.7534 39.8438 59.375ZM92.9688 45.3125V68.75C92.9688 70.2004 92.3926 71.5914 91.367 72.617C90.3414 73.6426 88.9504 74.2188 87.5 74.2188H52.3438V87.5C52.3438 88.1216 52.0968 88.7177 51.6573 89.1573C51.2177 89.5968 50.6216 89.8438 50 89.8438C49.3784 89.8438 48.7823 89.5968 48.3427 89.1573C47.9032 88.7177 47.6562 88.1216 47.6562 87.5V74.2188H12.5C11.0496 74.2188 9.6586 73.6426 8.63301 72.617C7.60742 71.5914 7.03125 70.2004 7.03125 68.75V45.3125C7.03849 39.3059 9.4278 33.5474 13.6751 29.3001C17.9224 25.0528 23.6809 22.6635 29.6875 22.6562H60.1562V9.375C60.1562 8.7534 60.4032 8.15726 60.8427 7.71772C61.2823 7.27818 61.8784 7.03125 62.5 7.03125H75C75.6216 7.03125 76.2177 7.27818 76.6573 7.71772C77.0968 8.15726 77.3438 8.7534 77.3438 9.375C77.3438 9.9966 77.0968 10.5927 76.6573 11.0323C76.2177 11.4718 75.6216 11.7188 75 11.7188H64.8438V22.6562H70.3125C76.3191 22.6635 82.0776 25.0528 86.3249 29.3001C90.5722 33.5474 92.9615 39.3059 92.9688 45.3125ZM47.6562 69.5312V45.3125C47.6562 40.5469 45.7631 35.9765 42.3933 32.6067C39.0235 29.2369 34.4531 27.3438 29.6875 27.3438C24.9219 27.3438 20.3515 29.2369 16.9817 32.6067C13.6119 35.9765 11.7188 40.5469 11.7188 45.3125V68.75C11.7188 68.9572 11.8011 69.1559 11.9476 69.3024C12.0941 69.4489 12.2928 69.5312 12.5 69.5312H47.6562ZM88.2812 45.3125C88.275 40.5488 86.3799 35.982 83.0115 32.6135C79.643 29.2451 75.0762 27.35 70.3125 27.3438H64.8438V56.25C64.8438 56.8716 64.5968 57.4677 64.1573 57.9073C63.7177 58.3468 63.1216 58.5938 62.5 58.5938C61.8784 58.5938 61.2823 58.3468 60.8427 57.9073C60.4032 57.4677 60.1562 56.8716 60.1562 56.25V27.3438H43.4727C46.2318 29.4566 48.4672 32.1765 50.0057 35.2926C51.5441 38.4087 52.3441 41.8373 52.3438 45.3125V69.5312H87.5C87.7072 69.5312 87.9059 69.4489 88.0524 69.3024C88.1989 69.1559 88.2812 68.9572 88.2812 68.75V45.3125Z"
                      fill="#181818"
                    />
                  </svg>
                </div>
                <h5>Sign Up To Receive The Latest News From Us!</h5>
              </div>
              <form
                id="subscribe-form"
                action="#"
                className="form-newsletter-subscribe-2"
                method="post"
                acceptCharset="utf-8"
                data-mailchimp="true"
              >
                <div id="subscribe-content">
                  <input
                    type="email"
                    name="email-form"
                    id="subscribe-email"
                    placeholder="Enter your e-mail"
                  />
                  <button
                    type="button"
                    id="subscribe-button"
                    className="btn-style-2 w-100 btn-lg-2"
                  >
                    <span className="text text-button letter-0">
                      Subscribe Now
                    </span>
                  </button>
                </div>
                <div id="subscribe-msg" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
