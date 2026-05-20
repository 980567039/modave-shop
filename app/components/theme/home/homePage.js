"use client";
import Image from "next/image";

import { ArrowUpRight, Loader2, Plus, } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import MainSlider from "../mainCarousel/mainSlider";
import { VelocityScroll } from "../text/scrollBasedVelocity";
import ProductCard from "../cards/productCard";
import HighlightedCategories from "./highlightedCategories";
import OrganizeCategoryView from "./organizeCategoryView";
import StoreCarousel from "../common/storeCarousel";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { IconInstagramColor } from "../../svgIcons";
import HomeDataJsonLd from "./homeDataJsonLd";
import TrendingSection from "./trendingSection";
import FeaturedProducts from "./featuredProducts";


// AnimatedSection component for reusable scroll animations
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -200px 0px"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage({ initialData }) {
  const [homeData, setHomeData] = useState(initialData || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {    
    setHomeData(initialData);
  }, [initialData])

  return (
    <>
      <HomeDataJsonLd store={initialData} />
      <MainSlider fullData={initialData?.header} data={initialData?.header?.slider || []} isLoading={isLoading} />

      <div className="px-3 mx-auto -mt-5 z-40 relative">
        <div className="bg-black rounded-3xl">
          <div className="p-2 lg:px-[3vw] xl:px-[9.3vw] mx-auto xl:py-[110px] xl:pb-[150px] text-white">
            <AnimatedSection className="flex flex-col gap-1 items-center justify-center mb-3 pt-3 lg:pt-0 lg:mb-10 relative">
              {homeData?.latestArrival?.sectionTitle && <h2 className="text-center font-semibold text-[20px] md:text-[30px] uppercase tracking-widest font-headingFontRegular">{homeData?.latestArrival?.sectionTitle}</h2>}
              {homeData?.latestArrival?.viewMoreUrl && <Link href={homeData?.latestArrival?.viewMoreUrl} className="
                text-[12px] 
                uppercase 
                tracking-[1.9px] 
                flex 
                items-center 
                gap-2 
                md:absolute 
                md:right-0 
                transition-all 
                ease-in-out 
                delay-75 
                hover:underline 
                hover:tracking-[2px]">{homeData?.latestArrival?.linkText || 'View all'}<Plus size={16} strokeWidth={1.5} /></Link>}
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4  gap-5 p-5 xl:p-0">
              {homeData?.latestArrival?.products && homeData?.latestArrival?.products.map((product, i) => (
                <AnimatedSection key={`${product.id}_${i}_${product.title}`}>
                  <ProductCard data={product} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? <div className="flex flex-col md:flex-row mb-0 lg:mb-0">
        <div className="w-full lg:w-7/12">
          <div className="overflow-hidden relative h-full block">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
        <div className="w-full lg:w-5/12 flex md:flex-col">
          <div className="overflow-hidden relative lg:h-[500px] block group"><Skeleton className="w-full h-full" /></div>
          <div className="overflow-hidden relative lg:h-[500px] block group"><Skeleton className="w-full h-full" /></div>
        </div>

      </div> : homeData?.highlightedCategories && homeData?.highlightedCategories?.length > 0 && <AnimatedSection className="mb-3">
        <HighlightedCategories highlightedCategories={homeData?.highlightedCategories || []} selectedFeaturedCategories={homeData?.selectedFeaturedCategories || []} />
      </AnimatedSection>}

      <AnimatedSection>
        {/* Trending products */}
        <TrendingSection data={homeData?.trending} />
      </AnimatedSection>

      {/* list products */}

      <AnimatedSection>
        <FeaturedProducts />
      </AnimatedSection>



    </>
  );
}
