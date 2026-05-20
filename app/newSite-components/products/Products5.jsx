"use client";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";

import { useEffect, useReducer, useState } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/app/reducer/filterReducer";
import { apiReq } from "@/lib/common";
import FilterMeta from "./FilterMeta";

import Pagination from "../common/Pagination";

import ProductCard10 from "../productCards/ProductCard10";

export default function Products5() {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  const {
    price,
    availability,
    color,
    size,
    brands,
    category,
    activeFilterOnSale,
    sortingOption,
    currentPage,
    itemPerPage,
    sorted,
  } = state;

  const allProps = {
    ...state,
    setPrice: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_PRICE", payload: value });
    },
    setColor: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      value == color
        ? dispatch({ type: "SET_COLOR", payload: "All" })
        : dispatch({ type: "SET_COLOR", payload: value });
    },
    setSize: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      value == size
        ? dispatch({ type: "SET_SIZE", payload: "All" })
        : dispatch({ type: "SET_SIZE", payload: value });
    },
    setAvailability: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      value == availability
        ? dispatch({ type: "SET_AVAILABILITY", payload: "All" })
        : dispatch({ type: "SET_AVAILABILITY", payload: value });
    },
    setBrands: (newBrand) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      const updated = [...brands].includes(newBrand)
        ? [...brands].filter((elm) => elm != newBrand)
        : [...brands, newBrand];
      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    removeBrand: (newBrand) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      const updated = [...brands].filter((brand) => brand != newBrand);
      dispatch({ type: "SET_BRANDS", payload: updated });
    },
    setSortingOption: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_SORTING_OPTION", payload: value });
    },
    toggleFilterWithOnSale: () => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "TOGGLE_FILTER_ON_SALE" });
    },
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
    clearFilter: () => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "CLEAR_FILTER" });
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("limit", itemPerPage);
        params.append("page", currentPage);

        if (category && category !== "All") params.append("category", category);
        if (color && color !== "All") params.append("color", color.termName || color.name || color);
        if (size && size !== "All" && size !== "Free Size") params.append("size", size);
        if (activeFilterOnSale) params.append("isSales", "true");

        // Sorting
        if (sortingOption === "Price Ascending") params.append("sort", "price_asc");
        else if (sortingOption === "Price Descending") params.append("sort", "price_desc");
        else if (sortingOption === "Title Ascending") params.append("sort", "title_asc");
        else if (sortingOption === "Title Descending") params.append("sort", "title_desc");

        // Price range
        if (price && price.length === 2) {
          params.append("minPrice", price[0]);
          params.append("maxPrice", price[1]);
        }

        const queryString = params.toString();
        const response = await apiReq(`site/product?${queryString}`, "GET");
        const { data } = await response.json();

        if (data && data.products) {
          const mappedProducts = data.products.map(p => {
             const colors = p.attributes?.find(attr => attr.name === "Color")?.values || [];
             const sizes = p.attributes?.find(attr => attr.name === "Size")?.values || [];
             const brand = p.attributes?.find(attr => attr.name === "Brand")?.values[0];
 
             return {
               ...p,
               id: p._id,
               imgSrc: p.defaultImage?.url,
               filterBrands: brand ? [brand] : [],
               filterColor: colors.map(c => c.value),
               filterSizes: sizes.map(s => s.value),
               productCategories: p.category ? p.category.map(c => c.title) : [],
               price: parseFloat(p.price) || 0,
               oldPrice: parseFloat(p.salePrice) || 0,
               isOnSale: p.salePrice > 0,
               inStock: p.inStock
             };
          });

          dispatch({ type: "SET_SORTED", payload: mappedProducts });
          dispatch({ type: "SET_TOTAL_PRODUCTS", payload: data.pagination.totalItems });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
        fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [category, color, size, activeFilterOnSale, sortingOption, currentPage, itemPerPage, price, brands, availability]);

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <a
                href="#filterShop"
                data-bs-toggle="offcanvas"
                aria-controls="filterShop"
                className="tf-btn-filter"
              >
                <span className="icon icon-filter" />
                <span className="text">Filters</span>
              </a>
              <div
                onClick={allProps.toggleFilterWithOnSale}
                className={`d-none d-lg-flex shop-sale-text ${activeFilterOnSale ? "active" : ""
                  }`}
              >
                <i className="icon icon-checkCircle" />
                <p className="text-caption-1">Shop sale items only</p>
              </div>
            </div>
            <ul className="tf-control-layout">
              <LayoutHandler
                setActiveLayout={setActiveLayout}
                activeLayout={activeLayout}
              />
            </ul>
            <div className="tf-control-sorting">
              <p className="d-none d-lg-block text-caption-1">Sort by:</p>
              <Sorting allProps={allProps} />
            </div>
          </div>
          <div className="wrapper-control-shop">
            <FilterMeta productLength={state.totalProducts} allProps={allProps} />

            {activeLayout == 1 ? (
              <div className="tf-list-layout wrapper-shop" id="listLayout">
                {loading ? Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="card-product list-layout" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                      <div className="card-product-wrapper" style={{ width: '30%', backgroundColor: '#f5f5f5', aspectRatio: '3/4', borderRadius: '4px' }}></div>
                      <div className="card-product-info" style={{ flex: 1, paddingTop: '10px' }}>
                         <div style={{ height: '20px', width: '60%', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '4px' }}></div>
                         <div style={{ height: '16px', width: '40%', backgroundColor: '#f5f5f5', marginBottom: '15px', borderRadius: '4px' }}></div>
                         <div style={{ height: '40px', width: '100%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}></div>
                      </div>
                   </div>
                )) : 
                  <Listview 
                    products={sorted} 
                    totalPages={Math.ceil(state.totalProducts / itemPerPage)}
                    currentPage={currentPage}
                    onPageChange={allProps.setCurrentPage}
                  />
                }
              </div>
            ) : (
              <div
                className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                id="gridLayout"
              >
                {loading ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="card-product">
                      <div className="card-product-wrapper" style={{ backgroundColor: '#f5f5f5', aspectRatio: '3/4', borderRadius: '4px', marginBottom: '10px' }}></div>
                      <div className="card-product-info">
                        <div style={{ height: '16px', width: '80%', backgroundColor: '#f5f5f5', marginBottom: '8px', borderRadius: '4px' }}></div>
                        <div style={{ height: '14px', width: '40%', backgroundColor: '#f5f5f5', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                )) : (
                  <>
                    {sorted.map((product, index) => (
                      <ProductCard10
                        key={index}
                        product={product}
                        gridClass="grid"
                      />
                    ))}
                    {/* pagination */}
                    {state.totalProducts > itemPerPage && (
                      <ul className="wg-pagination justify-content-center">
                        <Pagination 
                          totalPages={Math.ceil(state.totalProducts / itemPerPage)}
                          currentPage={currentPage}
                          onPageChange={allProps.setCurrentPage}
                        />
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} />
    </>
  );
}
