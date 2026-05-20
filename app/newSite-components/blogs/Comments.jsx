import React from "react";
import Image from "next/image";
export default function Comments() {
  return (
    <div className="reply-comment">
      <h4 className="reply-comment-heading">03 Comments</h4>
      <div className="reply-comment-wrap">
        <div className="reply-comment-item">
          <div className="image">
            <Image
              alt=""
              src="/newSite-images/avatar/user-1.jpg"
              width={90}
              height={113}
            />
          </div>
          <div className="content">
            <div>
              <h6>
                <a href="#" className="link">
                  Guy Hawkins
                </a>
              </h6>
              <div className="day text-caption-1">August 13, 2024</div>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur. Cursus nunc pharetra arcu
              quam turpis risus amet turpis. Facilisis elementum tincidunt
              pellentesque sed rutrum enim.
            </p>
            <div>
              <a className="text-button" href="#">
                Reply
              </a>
            </div>
          </div>
        </div>
        <div className="reply-comment-item type-reply">
          <div className="image">
            <Image
              alt=""
              src="/newSite-images/avatar/user-2.jpg"
              width={90}
              height={113}
            />
          </div>
          <div className="content">
            <div>
              <div className="d-flex gap-12 align-items-center">
                <h6>
                  <a href="#" className="link">
                    Eleanor Pena
                  </a>
                </h6>
                <div className="box-check">
                  <svg
                    width={10}
                    height={8}
                    viewBox="0 0 10 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.39644 7.84288L0.146441 4.35628C-0.0488135 4.14681 -0.0488135 3.80718 0.146441 3.59769L0.853531 2.8391C1.04879 2.62961 1.36539 2.62961 1.56064 2.8391L3.75 5.18782L8.43936 0.157101C8.63461 -0.0523671 8.95121 -0.0523671 9.14647 0.157101L9.85356 0.915689C10.0488 1.12516 10.0488 1.46479 9.85356 1.67428L4.10355 7.8429C3.90828 8.05237 3.5917 8.05237 3.39644 7.84288Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <div className="day text-caption-1">August 13, 2024</div>
            </div>
            <p>Great choice of Acronym AF1’s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
