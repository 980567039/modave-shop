import { testimonials7 } from "@/app/newSite-data/testimonials";
import React from "react";

export default function Testimonials2() {
  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout md-col-3 mb_30">
          {testimonials7.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-item style-4 wow fadeInUp"
              data-wow-delay={testimonial.delay}
            >
              <div className="content-top">
                <div className="box-icon">
                  <i className="icon icon-quote" />
                </div>
                <div className="text-title">{testimonial.title}</div>
                <p className="text-secondary">{testimonial.text}</p>
                <div className="box-rate-author">
                  <div className="box-author">
                    <div className="text-title author">
                      {testimonial.author}
                    </div>
                  </div>
                  <div className="list-star-default color-primary">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <i key={starIndex} className="icon icon-star" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ul className="wg-pagination justify-content-center">
          <li>
            <a href="#" className="pagination-item text-button">
              1
            </a>
          </li>
          <li className="active">
            <div className="pagination-item text-button">2</div>
          </li>
          <li>
            <a href="#" className="pagination-item text-button">
              3
            </a>
          </li>
          <li>
            <a href="#" className="pagination-item text-button">
              <i className="icon-arrRight" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
