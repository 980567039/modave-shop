import React, { useState, useCallback, useRef, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/app/hooks/useDebounce";
import { apiReq, formatPrice } from "@/lib/common";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter } from "@/components/ui/drawer";

// Helper function to highlight text matches
const HighlightText = ({ text, query }) => {
  if (!query || query.length < 2) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ?
          <span key={index} className="bg-blue-500/40 font-bold border-b-[1px] border-white/45">{part}</span> :
          <span key={index}>{part}</span>
      )}
    </>
  );
};

export default function GlobeSearch({ isScroll }) {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const searchInputRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Use the debounce hook to delay the search text updates
  const debouncedSearchText = useDebounce(searchText, 500); // 500ms debounce delay

  // Function to handle search input change
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    if (e.target.value.length <= 2) {
      // Clear results when search is too short
      setSearchResults([]);
      setIsLoading(false);
    }
  };

  // Function to handle search query using useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback(async (query) => {
    // Don't search if query is less than 3 characters
    if (!query || query.length < 3) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call your API endpoint with the search query
      const response = await apiReq(`site/search?query=${query}`, "GET");

      // Parse the response JSON
      const data = await response?.json();

      // Check if the response is valid
      if (data && data.products && data.products.length > 0) {
        setSearchResults(data.products);
      } else {
        setSearchResults([]);
        setError('No results found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger search when the debounced search text changes
  useEffect(() => {
    if (debouncedSearchText.length >= 3) {
      handleSearch(debouncedSearchText);
    }
  }, [debouncedSearchText, handleSearch]);

  // Focus the input when dropdown opens
  useEffect(() => {
  

    if (isOpen && inputRef.current && !isDesktop) {
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [isOpen]);

  // Handle dropdown open/close
  const handleDropdownOpenChange = (open) => {
    setIsOpen(open);

    // Clear search text and results when dropdown closes
    if (!open) {
      setSearchText('');
      setSearchResults([]);
      setError(null);
    }
  };

  // Render search results
  const renderSearchResults = (d) => {
    const isMobile = d === 'mobile';

    const textColor = isMobile ? 'text-black' : 'text-white';

    if (error) {
      return (
        <div className={`${textColor} text-center py-4`}>
          <p>{error}</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex gap-3 flex-col w-full">
          <Skeleton className="h-[80px] rounded-3xl opacity-80" />
          <Skeleton className="h-[80px] rounded-3xl opacity-80" />
          <Skeleton className="h-[80px] rounded-3xl opacity-80" />
        </div>
      );
    }

    if (searchResults.length === 0 && debouncedSearchText.length >= 3) {
      return (
        <div className={`${textColor} text-center py-4`}>
          <p>No results found for {debouncedSearchText}</p>
        </div>
      );
    }



    return searchResults.map((product) => (
      <Link
        href={`/product/${product.titleSlug || product._id}`}
        key={product._id}
        className="flex items-center gap-2 p-2 rounded-2xl hover:bg-white/10 transition-colors duration-200"
        onClick={() => handleDropdownOpenChange(false)}
      >
        <img
          src={product.defaultImage?.url || "/placeholder-product.jpg"}
          alt={product.title}
          width={50}
          height={50}
          className="w-18 h-18 rounded-xl object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
        <div className="flex flex-col gap-1">
          <div>
            <h3 className={`${textColor} font-headingFontMedium text-sm line-clamp-1`}>
              <HighlightText text={product.title} query={debouncedSearchText} />
            </h3>
            <p className="text-[11px] font-semibold ${textColor}/70">
              {product?.inStock ? <p className="text-green-600">In Stock</p> : <p className="text-red-600">Out of Stock</p>}
            </p>
          </div>
          <p className={`${textColor} text-xs`}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link >
    ));
  };

  return isDesktop ? (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger
          className="w-12 h-12 rounded-full p-1 transition-all ease-in-out delay-75 hover:border-white/60 flex items-center justify-center border-[1px] border-white/50"
          aria-label="Search products"
        >
          <Search
            className={`w-4 h-4 ${isScroll ? "text-white" : "text-white"}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-3xl border-0 backdrop-blur-xl p-8 min-w-[600px] bg-black/80 top-10"
          side="bottom"
          align="end"
          onCloseAutoFocus={(e) => {
            // Prevent focus return behavior that might cause UI issues
            e.preventDefault();
          }}
        >
          <h3 className="text-white font-headingFontMedium uppercase mb-2">Search Products</h3>
          <Input
            ref={inputRef}
            placeholder="Search products (min 3 characters)"
            className="bg-white/10 border-white/15 focus-visible:ring-1 focus-visible:ring-white/30 text-white h-[45px] mb-3"
            value={searchText}
            onChange={handleSearchInput}
            aria-label="Search input"
          />

          <ScrollArea className="h-[30vh] flex flex-col gap-2">
            {searchText.length < 3 && !isLoading && (
              <div className="text-white/50 text-center py-4">
                <p>Enter at least 3 characters to search</p>
              </div>
            )}
            {renderSearchResults()}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <>
      <Button className='fixed bottom-2 right-3 bg-black w-16 h-16 border-0 rounded-full p-1 transition-all ease-in-out delay-75 hover:border-white/60 hover:bg-transparent flex items-center justify-center' variant="ghost" onClick={() => setIsOpen(true)} aria-label="Search">
        <Search
          className={`w-6 h-6 ${isScroll ? "text-white" : "text-white"}`}
        />
      </Button>

      <Sheet open={isOpen} onOpenChange={handleDropdownOpenChange}>
        <SheetContent side="bottom" className="rounded-tl-2xl rounded-tr-2xl ">
          <div className="max-h-[calc(100vh-100px)] min-h-[60vh] overflow-y-auto">
            <h3 className="font-headingFontMedium uppercase mb-2">Search Products</h3>
            <Input
              ref={searchInputRef}
              placeholder="Search products (min 3 characters)"
              className="bg-black/10  focus-visible:ring-1 focus-visible:ring-black/30 h-[45px] mb-3"
              value={searchText}
              onChange={handleSearchInput}
              aria-label="Search input"
            />

            <div className="max-h-[calc(100vh-250px)] flex flex-col gap-2 overflow-y-auto">
              {searchText.length < 3 && !isLoading && (
                <div className="text-black/50 text-center py-4">
                  <p>Enter at least 3 characters to search</p>
                </div>
              )}
              {renderSearchResults('mobile')}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}