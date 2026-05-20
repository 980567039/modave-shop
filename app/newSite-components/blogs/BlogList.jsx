import React from "react";
import Sidebar from "./Sidebar";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
import { blogPosts6 } from "@/app/newSite-data/blogs";
export default function BlogList() {
  return (
    <div className="main-content-page">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-lg-30">
            {blogPosts6.slice(0, 5).map((post, i) => (
              <div key={i} className="wg-blog style-row hover-image mb_40">
                <div className="image">
                  <Image
                    className="lazyload"
                    alt=""
                    src={post.imgSrc}
                    width={600}
                    height={399}
                  />
                </div>
                <div className="content">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-10">
                    <div className="meta">
                      <div className="meta-item gap-8">
                        <div className="icon">
                          <i className="icon-calendar" />
                        </div>
                        <p className="text-caption-1">{post.date}</p>
                      </div>
                      <div className="meta-item gap-8">
                        <div className="icon">
                          <i className="icon-user" />
                        </div>
                        <p className="text-caption-1">
                          by{" "}
                          <a className="link" href="#">
                            {post.author}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <h5 className="title">
                    <Link className="link" href={`/blog-detail/${post.id}`}>
                      {post.title}
                    </Link>
                  </h5>
                  <p>{post.description.split(" ").slice(0, 10).join(" ")}</p>
                  <Link
                    href={`/blog-detail/${post.id}`}
                    className="link text-button bot-button"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
            <ul className="wg-pagination">
              <Pagination />
            </ul>
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
