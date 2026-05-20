"use client";
import React, { useState } from "react";

export default function Pagination({
  totalPages = 3,
  currentPage: propCurrentPage,
  onPageChange,
}) {
  const [internalPage, setInternalPage] = useState(1);
  const currentPage =
    propCurrentPage !== undefined ? propCurrentPage : internalPage;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      if (propCurrentPage === undefined) {
        setInternalPage(page);
      }
      if (onPageChange) {
        onPageChange(page);
      }
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return (
        <li
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => handlePageClick(page)}
        >
          <div className="pagination-item text-button">{page}</div>
        </li>
      );
    });
  };

  return (
    <>
      <li onClick={() => handlePageClick(currentPage - 1)}>
        <a
          className={`pagination-item text-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <i className="icon-arrLeft" />
        </a>
      </li>
      {renderPageNumbers()}
      <li onClick={() => handlePageClick(currentPage + 1)}>
        <a
          className={`pagination-item text-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <i className="icon-arrRight" />
        </a>
      </li>
    </>
  );
}
