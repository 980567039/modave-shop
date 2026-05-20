"use client";
import React, { useState, useEffect } from "react";
import ProductCard1 from "../productCards/ProductCard1";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setQuery(searchQuery);
      fetchProducts(searchQuery);
    } else {
      setQuery("");
      fetchProducts(""); // Fetch all products if no search query
    }
  }, [searchParams]);

  const fetchProducts = async (searchQuery) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/site/product?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.data.products || []);
      } else {
        console.error("Search failed:", data.error);
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search-result?search=${encodeURIComponent(query)}`);
    } else {
        router.push(`/search-result`);
    }
  };

  return (
    <>
      {/* search */}
      <section className="flat-spacing page-search-inner">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <form
                className="form-search"
                onSubmit={handleSearch}
              >
                <fieldset className="text">
                  <input
                    type="text"
                    placeholder="Searching..."
                    className=""
                    name="text"
                    tabIndex={0}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
              <div className="tf-col-quicklink">
                <span className="title">Quick link:</span>
                <Link className="link" href={`/shop-default-grid`}>
                  Fashion
                </Link>
                ,
                <Link className="link" href={`/shop-default-grid`}>
                  Men
                </Link>
                ,
                <Link className="link" href={`/shop-default-grid`}>
                  Women
                </Link>
                ,
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /search */}
      
      {/* Search Results */}
      <section className="flat-spacing pt-0">
        <div className="container">
          <div className="heading-section text-center wow fadeInUp">
            <h3 className="heading">
              {loading
                ? "Searching..."
                : query
                ? `Search Results for "${query}"`
                : "All Products"}
            </h3>
          </div>

          {!loading && results.length === 0 ? (
            <div className="text-center">No products found.</div>
          ) : (
            <div className="tf-grid-layout tf-col-2 tf-col-md-4 tf-col-lg-4 tf-col-xl-4">
              {results.map((product) => (
                <ProductCard1
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
