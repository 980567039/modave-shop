"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard1 from "../productCards/ProductCard1";

export default function SearchModal() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/site/product?search=${encodeURIComponent(searchQuery)}&limit=4`,
          { signal: controller.signal }
        );
        const data = await res.json();

        if (res.ok) {
          setResults(data.data?.products || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching search suggestions:", error);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();

    const searchQuery = query.trim();
    router.push(
      searchQuery
        ? `/search-result?search=${encodeURIComponent(searchQuery)}`
        : "/search-result"
    );
  };

  return (
    <div className="modal fade modal-search" id="search">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Search</h5>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <form className="form-search" onSubmit={handleSearch}>
            <fieldset className="text">
              <input
                type="text"
                placeholder="Searching..."
                className=""
                name="text"
                tabIndex={0}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
          <div>
            <h5 className="mb_16">Feature keywords Today</h5>
            <ul className="list-tags">
              <li>
                <Link href="/search-result?search=dresses" className="radius-60 link">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/search-result?search=women" className="radius-60 link">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/search-result?search=summer" className="radius-60 link">
                  Summer
                </Link>
              </li>
              <li>
                <Link href="/shop-default-grid" className="radius-60 link">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          {query.trim() && (
            <div>
              <h6 className="mb_16">
                {loading ? "Searching..." : "Search suggestions"}
              </h6>
              {!loading && results.length === 0 ? (
                <p className="text-secondary">No products found.</p>
              ) : (
                <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
                  {results.map((product) => (
                    <ProductCard1
                      product={product}
                      key={product._id || product.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
