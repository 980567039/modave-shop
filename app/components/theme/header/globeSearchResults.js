import React from "react";
import Image from "next/image";
import ProductCard from "../cards/productCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GableSearchResults({
  isLoading,
  searchResults,
  searchQuery
}) {
  return (
    <div className="px-6">
      {isLoading ? (
        <div className="text-center py-4">Searching...</div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {searchQuery && searchResults.length > 0 ? searchResults.map((product, key) => <ProductCard key={key} data={product} />)  : searchQuery && searchQuery.length > 0 ? (
              <div className="col-span-full text-center py-4">
                No products found
              </div>
            ) : null}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
