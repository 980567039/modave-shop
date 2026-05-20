"use client";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import { useEffect, useReducer, useRef, useState } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/app/reducer/filterReducer";
import FilterMeta from "./FilterMeta";
import { apiReq } from "@/lib/common";

export default function Products15({ parentClass = "flat-spacing" }) {
  const [activeLayout, setActiveLayout] = useState(4);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [loadedItems, setLoadedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

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
               imgHover: p.imageGallery?.[0]?.url || p.defaultImage?.url,
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

          if (currentPage === 1) {
            setLoadedItems(mappedProducts);
          } else {
            setLoadedItems(prev => [...prev, ...mappedProducts]);
          }
          
          dispatch({ type: "SET_TOTAL_PRODUCTS", payload: data.pagination.totalItems });
          // If current page is last page or beyond, set hasMore to false
          setHasMore(data.pagination.page < data.pagination.totalPages);
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

  const handleLoad = () => {
    if (!loading && hasMore) {
        dispatch({ type: "SET_CURRENT_PAGE", payload: currentPage + 1 });
    }
  };
  
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoad();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <>
      <section className={parentClass}>
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
                <Listview pagination={false} products={loadedItems} />
              </div>
            ) : (
              <div
                className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                id="gridLayout"
              >
                <GridView pagination={false} products={loadedItems} />
              </div>
            )}
            {hasMore ? (
               <div
                className="wd-load d-flex justify-content-center"
                onClick={() => handleLoad()}
               >
                <button
                  ref={elementRef}
                  className={`load-more-btn btn-out-line btn-infinite-scroll tf-loading ${loading ? "loading" : ""
                    } `}
                ></button>
              </div>
            ) : (
              <div className="d-flex justify-content-center" style={{padding: '20px'}}>
                  <p className="text-caption-1">No more products</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <FilterModal allProps={allProps} />
    </>
  );
}
