"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { blogPosts6 } from "@/app/newSite-data/blogs";
export default function Sidebar() {
  return (
    <div className="sidebar maxw-360">
      <div className="sidebar-item sidebar-search">
        <form className="form-search" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="text">
            <input
              type="email"
              placeholder="Your email address"
              className=""
              name="email"
              tabIndex={0}
              defaultValue=""
              aria-required="true"
              required
            />
          </fieldset>
          <button className="" type="submit">
            <svg
              className="icon"
              width={20}
              height={20}
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
          </button>
        </form>
      </div>
      <div className="sidebar-item sidebar-relatest-post">
        <h5 className="sidebar-heading">Relatest Post</h5>
        <div>
          {blogPosts6.slice(3, 8).map((post, i) => (
            <div
              key={i}
              className={`relatest-post-item ${
                i != 0 ? "style-row" : ""
              } hover-image `}
            >
              <div className="image">
                <Image
                  className="lazyload"
                  alt=""
                  src={post.imgSrc}
                  width={540}
                  height={360}
                />
              </div>
              <div className="content">
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
                <h6 className="title fw-5">
                  <Link className="link" href={`/blog-detail/${post.id}`}>
                    {post.description.split(" ").slice(0, 8).join(" ")}
                  </Link>
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-item sidebar-categories">
        <h5 className="sidebar-heading">Categories</h5>
        <ul>
          <li>
            <a className="text-button link" href="#">
              Trending
            </a>
          </li>
          <li>
            <a className="text-button link" href="#">
              Fashion
            </a>
          </li>
          <li>
            <a className="text-button link" href="#">
              Outfit
            </a>
          </li>
          <li>
            <a className="text-button link" href="#">
              Accessories
            </a>
          </li>
          <li>
            <a className="text-button link" href="#">
              Beauty
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar-item sidebar-tag">
        <h5 className="sidebar-heading">Popular Tag</h5>
        <ul className="list-tags">
          <li>
            <a href="#" className="text-caption-1 link">
              Fashion Trends
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Sustainable Fashion
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Street Style
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Beauty Tips
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Street Style
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Vintage Fashion
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Eco Friendly
            </a>
          </li>
          <li>
            <a href="#" className="text-caption-1 link">
              Tips
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
