import React from "react";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import Image from "next/image";
export default function BlogDetail1({ blog }) {
  return (
    <div className="blog-detail-wrap">
      <div className="image" />
      <div className="inner">
        <div className="heading">
          <ul className="list-tags has-bg justify-content-center">
            <li>
              <a href="#" className="link">
                Fashion Trends
              </a>
            </li>
          </ul>
          <h3 className="fw-5">{blog.title}</h3>
          <div className="meta justify-content-center">
            <div className="meta-item gap-8">
              <div className="icon">
                <i className="icon-calendar" />
              </div>
              <p className="body-text-1">February 28, 2024</p>
            </div>
            <div className="meta-item gap-8">
              <div className="icon">
                <i className="icon-user" />
              </div>
              <p className="body-text-1">
                by{" "}
                <a className="link" href="#">
                  Themesflat
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="content">
          <p className="body-text-1 mb_12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            interdum sed mauris eu imperdiet. Donec congue orci nec mi luctus,
            ut faucibus mauris scelerisque. Donec orci lorem, volutpat a mauris
            nec, sodales imperdiet urna. Sed dictum enim libero. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Maecenas ligula
            libero, pharetra non dolor et, tempor bibendum magna. Mauris a
            efficitur nisi.
          </p>
          <p className="body-text-1">
            Praesent interdum lacus ac est viverra hendrerit. Aliquam dapibus,
            ante vitae mattis gravida, purus sapien interdum magna, convallis
            volutpat est turpis pulvinar dui. Aenean eu turpis est. In hac
            habitasse platea dictumst. Integer at lobortis metus. Proin molestie
            eget massa vel gravida. Suspendisse nec ante vel
          </p>
        </div>
        <div className="group-image d-flex gap-20">
          <div>
            <Image
              alt=""
              src="/newSite-images/blog/blog-details-3.jpg"
              width={623}
              height={468}
            />
          </div>
          <div>
            <Image
              alt=""
              src="/newSite-images/blog/blog-details-4.jpg"
              width={623}
              height={468}
            />
          </div>
        </div>
        <div className="content">
          <h3 className="fw-5 mb_16">How to deal with employee quitting</h3>
          <p className="body-text-1 mb_16">
            Donec eu dui condimentum, laoreet nulla vitae, venenatis ipsum.
            Donec luctus sem sit amet varius laoreet. Aliquam fermentum sit amet
            urna fringilla tincidunt. Vestibulum ullamcorper nec lacus ac
            molestie. Curabitur congue neque sed nisi auctor consequat.
            Pellentesque rhoncus tortor vitae ipsum sagittis tempor.
          </p>
          <p className="body-text-1 mb_16">
            Vestibulum et pharetra arcu. In porta lobortis turpis. Ut faucibus
            fermentum posuere. Suspendisse potenti. Mauris a metus sed est
            semper vestibulum. Mauris tortor sem, consectetur vehicula vulputate
            id, suscipit vel leo.
          </p>
          <ul className="list-text type-disc mb_16">
            <li className="body-text-1">
              15+ years of industry experience designing, building, and
              supporting large-scale distributed systems in production, with
              recent experience in building large scale cloud services.
            </li>
            <li className="body-text-1">
              Deep knowledge and experience with different security areas like
              identity and access management, cryptography, network security,
              etc.
            </li>
            <li className="body-text-1">
              Experience with database systems and database internals, such as
              query engines and optimizers are a big plus.
            </li>
            <li className="body-text-1">
              Strong fundamentals in computer science skills.
            </li>
            <li className="body-text-1">
              Expert-level development skills in Java or C++.
            </li>
            <li className="body-text-1">
              Knowledge of industry standard security concepts and protocols
              like SAML, SCIM, OAuth, RBAC, cryptography is a plus.
            </li>
            <li className="body-text-1">
              Advanced degree in Computer Science or related degree.
            </li>
            <li className="body-text-1">
              Ph.D. in the related field is a plus
            </li>
          </ul>
          <p className="body-text-1 mb_16">
            Curabitur aliquam ac arcu in mattis. Phasellus pulvinar erat at
            aliquam hendrerit. Nam ut velit dolor. Sed fermentum tempus odio, ac
            faucibus elit scelerisque consequat. Fusce ac malesuada elit. Nam at
            aliquam libero, quis lacinia erat. In hac habitasse platea dictumst.
            Suspendisse id dolor orci. Vivamus at aliquam tellus. Vestibulum a
            augue ac purus suscipit varius non eget lectus. Nam lobortis mauris
            luctus tristique feugiat. Nulla eleifend risus sit amet nisi
            feugiat, id eleifend sapien malesuada. Phasellus venenatis convallis
            mattis. Duis vel tempor eros. Mauris semper sollicitudin neque,
            imperdiet ultrices urna maximus id.
          </p>
        </div>
        <div className="bot d-flex justify-content-between gap-10 flex-wrap">
          <ul className="list-tags has-bg">
            <li>Tag:</li>
            <li>
              <a href="#" className="link">
                Fashion
              </a>
            </li>
            <li>
              <a href="#" className="link">
                Trending
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center justify-content-between gap-16">
            <p>Share this post:</p>
            <ul className="tf-social-icon style-1">
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
                <a href="#" className="social-pinterest">
                  <i className="icon icon-pinterest" />
                </a>
              </li>
              <li>
                <a href="#" className="social-instagram">
                  <i className="icon icon-instagram" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="related-post">
          <div className="pre w-50">
            <div className="text-btn-uppercase">
              <a href="#">Previous</a>
            </div>
            <h6 className="fw-5">
              <a className="link" href="#">
                How to choose the right customer
              </a>
            </h6>
          </div>
          <div className="next w-50">
            <div className="text-btn-uppercase text-end">
              <a href="#">Next</a>
            </div>
            <h6 className="fw-5 text-end">
              <a className="link" href="#">
                Starting your traveling blog with Vasco
              </a>
            </h6>
          </div>
        </div>
        <Comments />
        <CommentForm />
      </div>
    </div>
  );
}
