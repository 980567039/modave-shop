import React from "react";
import ProductCard1 from "../productCards/ProductCard1";
import Pagination from "../common/Pagination";

export default function GridView({ products, pagination = true, totalPages, currentPage, onPageChange }) {
  return (
    <>
      {products.map((product, index) => (
        <ProductCard1 key={index} product={product} gridClass="grid" />
      ))}
      {/* pagination */}
      {pagination ? (
        <ul className="wg-pagination justify-content-center">
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </ul>
      ) : (
        ""
      )}
    </>
  );
}
