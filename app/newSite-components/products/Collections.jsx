"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Image from "next/image";
import { apiReq } from "@/lib/common";

export default function Collections({ initialData = [], initialPagination }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 8
  });
  const [loading, setLoading] = useState(false);

  // Fetch data when page changes
  useEffect(() => {
    const fetchData = async () => {
      if (currentPage === 1 && initialData.length > 0) {
        // Use initial data for first page
        setData(initialData);
        if (initialPagination) {
          setPagination(initialPagination);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await apiReq(
          `site/categories?page=${currentPage}&limit=8`,
          "GET"
        );
        const result = await response.json();
        
        if (result.data) {
          setData(result.data);
          if (result.pagination) {
            setPagination(result.pagination);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Set initial pagination data
  useEffect(() => {
    if (initialData.length > 0 && currentPage === 1) {
      setData(initialData);
    }
  }, [initialData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout tf-col-2 lg-col-4">
          {loading && (
            <div className="col-span-full text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          {!loading && data.map((item, index) => (
            <div
              key={item._id || index}
              className="collection-position-2 radius-lg style-3 hover-img"
            >
              <a className="img-style">
                <Image
                  className="lazyload"
                  data-src={item.categoryImage?.url}
                  alt={`banner-${item.title?.toLowerCase()}`}
                  src={item.categoryImage?.url || '/images/placeholder.png'}
                  width={450}
                  height={600}
                />
              </a>
              <div className="content">
                <a href="#" className="cls-btn">
                  <h6 className="text">{item.title}</h6>
                  <span className="count-item text-secondary">
                    {item.productCount}
                  </span>
                  <i className="icon icon-arrowUpRight" />
                </a>
              </div>
            </div>
          ))}
          {/* pagination */}
          {pagination.totalPages > 1 && !loading && (
            <ul className="wg-pagination justify-content-center">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
